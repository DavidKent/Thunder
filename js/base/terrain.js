    var terrain_maps = { height: new Image(), shadow: new Image()};
    var terrain_mesh;
    var bake_shadows = false;
    var height_data;
    $(document).ready(loadTerrainImage);
    
    function loadTerrainImage() {
        terrain_maps.height.src = "assets/terrain/heightMap.jpg";
        $(terrain_maps.height).load(loadTerrainData);
    }
    function loadTerrainData() {
        loadHeight();
        if(bake_shadows)
            loadShadows();
        else
             terrain_maps.shadow.src = "assets/terrain/shadowMap.png";
    }
    function loadHeight() {
        var context = document.getElementById('test').getContext('2d');
        context.drawImage(terrain_maps.height, 0, 0);
        height_data = getHeightData();
    }
    function loadShadows() {
        //console.log(height_data);
        var canvas = bakeLighting(height_data);
        //console.log(canvas.toDataURL());
         try {
                try { 
                    terrain_maps.shadow.src = canvas.toDataURL();
                } 
                catch (e) { 
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");                     
                    terrain_maps.shadow.src = canvas.toDataURL();
                } 						 
        } 
        catch (e) {
          throw new Error("unable to access image data: " + e)
        } 
    }
    
    function build(){
        var data = height_data;
        var terrain = new THREE.PlaneGeometry( 510, 510, 254, 254 );
        for (var x = 0; x < terrain.vertices.length; x++)
               terrain.vertices[x].position.z = (255-data[x]);
        var lmap =  new THREE.ImageUtils.loadTexture( terrain_maps.shadow.src );
        terrain_mesh = new THREE.Mesh( terrain, new THREE.MeshLambertMaterial( { map:lmap, color:0xffffff, overdraw:true} )  );
        terrain.computeCentroids();
        terrain_mesh.rotation.x = -90 * Math.PI/180;
        terrain_mesh.y = -1;
        terrain_mesh.receiveShadow = true;
        terrain_mesh.castShadow = true;
        scene.add(terrain_mesh);
    }
    
    function getHeightData(callback) {
        var context = document.getElementById('test').getContext('2d');
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
                redVals.push(data[index]);
                index+=4;
            }
        data = [];
        if(callback != undefined)
            callback(redVals);
        return redVals;
    }
    
    function bakeLighting(data, callback) {
        var canvas, context, imageData,
        level, diff, vector3, sun, shade;
        vector3 = new THREE.Vector3( 0, 0, 0 );
        sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();
        canvas = $("#test").get(0);
        context = canvas.getContext( '2d' );
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
            imageData[ i ] = ( 96 + shade * 128 ) * ( data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( shade * 96 ) * ( data[ j ] * 0.007 );
        }
        context.putImageData( image, 0, 0 );
        if(callback != undefined)
            callback(canvas);
        return canvas;
        
    }
    
    function printView() {
        return { lat : controls.lat, lon : controls.lon };
    }
    
    function setView(lat, lon) {
        controls.lon = lon;
        controls.lat = lat;
    }
 
