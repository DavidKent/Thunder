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
    Thunder.Scene.scene.addObject( Thunder.skyboxMesh );
 
    addClouds();
}

function addClouds() {
    var h = new THREE.JSONLoader();
    
    h.load('assets/skies/cloud.js',function(geometry) {
        var texture = THREE.ImageUtils.loadTexture('assets/skies/cloud3.png');
        texture.magFilter = THREE.LinearMipMapLinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        var fog = new THREE.Fog(0x251d32, - 100, 5000);
        var meshMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'map': {type: 't', value:2, texture: texture},
                'fogColor' : {type: 'c', value: fog.color},
                'fogNear' : {type: 'f', value: fog.near},
                'fogFar' : {type: 'f', value: fog.far}

            },
            vertexShader: $("#cloud_vertexshader").text(),
            fragmentShader: $("#cloud_fragmentshader").text()
        });
        //meshMaterial.transparent = true;
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        Thunder.Scene.scene.addObject(mesh);
        console.log(String(cloudVertexShader()));
    });
}
function cloudVertexShader() {
    return '                                                                            \
    varying vec2 vTexCoord;                                                             \
    void main(void)                                                                     \
    {                                                                                   \
       gl_Position = ftransform();                                                      \
       vec2 Pos;                                                                        \
       Pos = sign(gl_Vertex.xy);                                                        \
       gl_Position = vec4(Pos, 0.0, 1.0);                                               \
       vTexCoord = Pos * 0.5 + 0.5;                                                     \
    }                                                                                   \
    ';
}
function cloudFragmentShader() {
    return '                                                                            \
    uniform sampler2D RTScene;                                                          \
    varying vec2 vTexCoord;                                                             \
    const float blurSize = 1.0/512.0;                                                   \
    void main(void)                                                                     \
    {                                                                                   \
       vec4 sum = vec4(0.0);                                                            \
       sum += texture2D(RTScene, vec2(vTexCoord.x - 4.0*blurSize, vTexCoord.y)) * 0.05; \ 
       sum += texture2D(RTScene, vec2(vTexCoord.x - 3.0*blurSize, vTexCoord.y)) * 0.09; \
       sum += texture2D(RTScene, vec2(vTexCoord.x - 2.0*blurSize, vTexCoord.y)) * 0.12; \
       sum += texture2D(RTScene, vec2(vTexCoord.x - blurSize, vTexCoord.y)) * 0.15;     \
       sum += texture2D(RTScene, vec2(vTexCoord.x, vTexCoord.y)) * 0.16;                \
       sum += texture2D(RTScene, vec2(vTexCoord.x + blurSize, vTexCoord.y)) * 0.15;     \
       sum += texture2D(RTScene, vec2(vTexCoord.x + 2.0*blurSize, vTexCoord.y)) * 0.12; \
       sum += texture2D(RTScene, vec2(vTexCoord.x + 3.0*blurSize, vTexCoord.y)) * 0.09; \
       sum += texture2D(RTScene, vec2(vTexCoord.x + 4.0*blurSize, vTexCoord.y)) * 0.05; \
                                                                                        \
       gl_FragColor = sum;                                                              \
                                                                                        \
    }                                                                                   \
    ';
}