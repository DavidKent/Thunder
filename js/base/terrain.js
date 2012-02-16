    var terrain_maps = { height: new Image(), diffuse: new Image()};
    var terrain_mesh;
    var bake_shadows = true;
    var height_data;
    
    function terrainPrefix() {
        return "assets/terrain/";
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
                var lightedImage = bakeLighting(data, terrain_maps.diffuse);
                var test = new THREE.Texture(lightedImage);
                test.needsUpdate = true;
                terrain_mesh = new THREE.Mesh( terrain, new THREE.MeshBasicMaterial({map:test, overdraw:true}));
                terrain.computeCentroids();
                terrain_mesh.rotation.x = -90 * Math.PI/180;
                terrain_mesh.y = -5;
                scene.add(terrain_mesh);
                //$("#terrainPainter").hide();
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
        terrain_maps.height.src = heightMap;
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
        $(terrain_maps.height).load(loadHeight);
    }
    
    function bakeLighting(data, diffuse) {
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
        return canvas;
        
    }
    
    function printView() {
        return { lat : controls.lat, lon : controls.lon };
    }
    
    function setView(lat, lon) {
        controls.lon = lon;
        controls.lat = lat;
    }
 
