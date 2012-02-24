var fgeo, grassMesh;
function setupGrass(texture) {
    fgeo = new THREE.Geometry();
    grassMesh = new THREE.ParticleBasicMaterial( { size: 25,
    map: THREE.ImageUtils.loadTexture( "assets/environment/grass/" + texture ),
    depthTest: true, transparent : true } );
}
function pushGrassLoc(vec3, texture) {
    var v3 = new THREE.Vector3( vec3.x, vec3.y, vec3.z +1);
    fgeo.vertices.push(new THREE.Vertex(v3));
}
function addGrassToScene() {
    var grass = new THREE.ParticleSystem( fgeo, grassMesh );
    grass.position = terrain_mesh.position;
    grass.rotation = terrain_mesh.rotation;
    grass.scale = terrain_mesh.scale;
    Thunder.Scene.scene.add(grass);
}