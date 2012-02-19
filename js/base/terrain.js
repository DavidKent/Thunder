    var terrain_maps = { height: new Image(), diffuse: new Image()};
    var terrain_mesh;
    var bake_shadows = true;
    var height_data;
    
    function terrainPrefix() {
        return "assets/terrain/";
    }

    function getMatShader() {
        var fShader = $('#terrain_fragmentshader');
        var vShader = $('#terrain_vertexshader');
        var uniforms = {
					m_grass: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "assets/terrain/grass.jpg" ) },
					m_dirt: { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( "assets/terrain/rocks.jpg" ) },
                    m_sand: { type: "t", value: 2, texture: THREE.ImageUtils.loadTexture( "assets/terrain/sand.jpg" ) },
                    m_alpha: { type: "t", value: 3, texture: THREE.ImageUtils.loadTexture( "assets/terrain/mission1_diffuseMap.png" ) },
                    uvScale: { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) }
				};
            uniforms.m_grass.texture.wrapS = uniforms.m_grass.texture.wrapT = THREE.Repeat;
			uniforms.m_dirt.texture.wrapS = uniforms.m_dirt.texture.wrapT = THREE.Repeat;
            uniforms.m_sand.texture.wrapS = uniforms.m_sand.texture.wrapT = THREE.Repeat;
            uniforms.m_alpha.texture.wrapS = uniforms.m_alpha.texture.wrapT = THREE.Repeat;
            
        var shaderMaterial = new THREE.ShaderMaterial({
            fragmentShader: fShader.text(),
            vertexShader: vShader.text(),
            uniforms: uniforms
        });
        return shaderMaterial;
    }
    function buildTerrain(heightMap, diffuseMap){
        terrain_maps.height.src = heightMap;
        var loadHeight = function() {
            var data = getHeightData();
            var terrain = new THREE.PlaneGeometry( 510, 510, 254, 254 );
            for (var x = 0; x < terrain.vertices.length; x++)
                   terrain.vertices[x].position.z = (data[x]);
            terrain_maps.diffuse.src = diffuseMap;
            var loadDiffuse = function() {
                //var lightedImage = bakeLighting(data, terrain_maps.diffuse);
                //var test = new THREE.Texture(lightedImage);
                //test.needsUpdate = true;
                //terrain_mesh = new THREE.Mesh( terrain, new THREE.MeshBasicMaterial({color:0xffffff, overdraw:true}));
                terrain_mesh = new THREE.Mesh( terrain, getMatShader() ); // 
                terrain_mesh.geometry.dynamic = true;
                terrain_mesh.geometry.__dirtyVertices = true;
                terrain.computeCentroids();
                terrain_mesh.rotation.x = -90 * Math.PI/180;
                terrain_mesh.y = -5;
                scene.add(terrain_mesh); 
                var verts = terrain_mesh.geometry.vertices.length;
                var col = parseInt(Math.sqrt(verts));
                var center = parseInt(verts/2);
                /*
                for(var i = center - 10; i < center; i++)
                    {
                        var loc = parseInt(i + ((Math.random()*2-1) * col));
                       
                        var vertex = terrain_mesh.geometry.vertices[loc];
                        var putGrass = Math.random() > 0.6 ? true : false;
                        if(putGrass) {
                            createGrass(vertex.position, 'grass.png');
                            camera.position = vertex.position;
                            vertices.push(vertex);
                        }
                    }
                    */
                setupGrass('grass.png');
                for(var i = 0; i < 1000; i++)
                {
                    var u = parseInt(Math.random() * (verts));
                    var vertex = terrain_mesh.geometry.vertices[u];
                    pushGrassLoc(vertex.position); 
                }
                addGrassToScene();
            }
            $(terrain_maps.diffuse).load(loadDiffuse);
        }
        $(terrain_maps.height).load(loadHeight);
    }
    
    function getHeightData() {
        var canvas = $("#terrainPainter").get(0);
        var context = canvas.getContext('2d');
        context.drawImage(terrain_maps.height, 0, 0);
        var data;
        try {
                try { 
                    data = context.getImageData(0, 0, 255, 255).data;
                } 
                catch (e) { 
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");                     
                    data = context.getImageData(0,0, 255, 255).data;
                } 						 
        } 
        catch (e) {
          throw new Error("unable to access image data: " + e)
        } 
    
        var redVals = [];
        var index = 0;
        while(index+4 < data.length)
            {
                redVals.push((255-data[index])/4);
                index+=4;
            }
        return redVals;
    }
    function testRelight(){
        rebakeLighting(terrainPrefix()+"mission1_newHeightMap.png",terrainPrefix()+"mission1_diffuseMap.png");
    }
    function rebakeLighting(heightMap, diffuseMap){ 
        /*terrain_maps.height.src = heightMap;
        var loadHeight = function() {
            var data = getHeightData();
            terrain_maps.diffuse.src = diffuseMap;
            var loadDiffuse = function() {
                var lightedImage = bakeLighting(data, terrain_maps.diffuse);
                var test = new THREE.Texture(lightedImage);
                test.needsUpdate = true;
                var newMat = new THREE.MeshBasicMaterial({map:test, overdraw:true});
                terrain_mesh.material = newMat;
            }
            $(terrain_maps.diffuse).load(loadDiffuse);
        }
        $(terrain_maps.height).load(loadHeight);*/
    }
    
    function bakeLighting(data, diffuse) {/*
        var canvas, context, imageData,
        level, diff, vector3, sun, shade;
        vector3 = new THREE.Vector3( 0, 0, 0 );
        sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();
        canvas = $("#terrainPainter").get(0);
        context = canvas.getContext( '2d' );
        context.drawImage(diffuse, 0, 0);
        try {
                try { 
                    imageData = context.getImageData(0, 0, 255, 255).data;
                } 
                catch (e) { 
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");                     
                    imageData = context.getImageData(0,0, 255, 255).data;
                } 						 
        } 
        catch (e) {
          throw new Error("unable to access image data: " + e)
        } 
        image = context.getImageData( 0, 0, 255, 255 );
        imageData = image.data;
        for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++  ) {
            vector3.x = data[ j - 1 ] - data[ j + 1 ];
            vector3.y = 2;
            vector3.z = data[ j - 255 ] - data[ j + 255 ];
            vector3.normalize();
            shade = vector3.dot( sun );
               
            imageData[ i ] = (imageData[i] - (shade * 90) );
            imageData[ i + 1 ] = ( imageData[i + 1] - (shade * 90)  ) ;
            imageData[ i + 2 ] = ( imageData[i + 2] - (shade * 90) ) ;
         
        }
        context.putImageData( image, 0, 0 );
        return canvas;*/
        
    }
    
    function printView() {
        return { lat : controls.lat, lon : controls.lon };
    }
    
    function setView(lat, lon) {
        controls.lon = lon;
        controls.lat = lat;
    }
 
