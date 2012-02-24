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
                var shader = getMatShader();
                shader.needsUpdate = true;
                terrain_mesh = new THREE.Mesh( terrain, shader ); // 
                Thunder.Physics.handleTerrain(terrain_mesh);
                terrain_mesh.geometry.dynamic = true;
                terrain_mesh.geometry.__dirtyVertices = true;
                terrain_mesh.rotation.x = -90 * Math.PI/180;
                Thunder.doNotSelect.push(terrain_mesh);
                Thunder.Scene.scene.add(terrain_mesh); 
                var verts = terrain_mesh.geometry.vertices.length;
                var col = parseInt(Math.sqrt(verts));
                var center = parseInt(verts/2);
                setupGrass('grass.png');
                for(var i = 0; i < 1000; i++)
                {
                    var u = parseInt(Math.random() * (verts));
                    var vertex = terrain_mesh.geometry.vertices[u];
                    pushGrassLoc(vertex.position); 
                }
                //addGrassToScene();
                
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
    
    function printView() {
        return { lat : controls.lat, lon : controls.lon };
    }
    
    function setView(lat, lon) {
        controls.lon = lon;
        controls.lat = lat;
    }
 
