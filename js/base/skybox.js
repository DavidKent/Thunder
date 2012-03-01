function loadSkybox() {
    var urlPrefix	= "assets/skies/day_sky/";
	var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
			urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
			urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	var shader = THREE.ShaderUtils.lib["cube"];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms['tCube'].texture = textureCube;
    var material = new THREE.MeshShaderMaterial({
        fragmentShader  : shader.fragmentShader,
        vertexShader    : shader.vertexShader,
        uniforms    : uniforms
    });
    
    Thunder.skyboxMesh  = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000, 1, 1, 1, null, true ), material );
    Thunder.skyboxMesh.flipSided = true;
    Thunder.doNotSelect.push(Thunder.skyboxMesh);
   // Thunder.Scene.scene.addObject( Thunder.skyboxMesh );
 

}

(function addClouds() {
    var h = new THREE.JSONLoader();
    
    h.load('assets/skies/nebula1.js',function(geometry) {
        var texture = THREE.ImageUtils.loadTexture('assets/skies/cloud3.png');
        texture.magFilter = THREE.LinearMipMapLinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        // var fog = new THREE.Fog(0x251d32, - 100, 5000);
         var meshMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'map': {type: 't', value:2, texture: texture}

            },
             vertexShader: $("#cloud_vertexshader").text(),
            fragmentShader: $("#cloud_fragmentshader").text()
         });
         meshMaterial.transparent = true;
        var mesh = new THREE.Mesh(geometry, meshMaterial);
        var properties = {
            opacity:0.5,
            map: texture,
        };
        //mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(properties));
        Thunder.Scene.scene.addObject(mesh);
    });
})();
function cloudVertexShader() {
  
}
function cloudFragmentShader() {
 
}