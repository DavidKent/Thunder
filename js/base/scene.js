Thunder.Scene.clock = new THREE.Clock;
Thunder.Scene.width = window.innerWidth, Thunder.Scene.height = window.innerHeight;

Thunder.Scene.init = function() {
    this.setupContainer = (function() {
        Thunder.Scene.container = document.createElement('div');
        document.body.appendChild(Thunder.Scene.container);
    })();

    this.setupCamera = (function() {
        Thunder.Scene.camera = new THREE.PerspectiveCamera(35, (Thunder.Scene.width) / (Thunder.Scene.height), 1, 100000);
        Thunder.Scene.camera.target = new THREE.Vector3(0, 0, 0);
        Thunder.Scene.camera.position = new THREE.Vector3(20,21,-30);
    })();

    this.setupScene = (function() {
        Thunder.Scene.scene = new THREE.Scene();
        Thunder.Scene.scene.add(Thunder.Scene.camera);
        Thunder.Scene.camera.lookAt(Thunder.Scene.scene.position);
    })();

    this.setupControls = (function() {
        Thunder.Scene.controls = new THREE.FirstPersonControls ( Thunder.Scene.camera );
        Thunder.Scene.controls.movementSpeed = 35;
        Thunder.Scene.controls.lookSpeed = 0.2;
        Thunder.Scene.controls.activeLook = false;
        Thunder.Scene.controls.lon = -229;
        Thunder.Scene.controls.lat = -29;
    })();

    this.addLights = (function() {
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(12, 16, -13).normalize();
        directionalLight.lookAt(Thunder.Scene.scene.position);
        Thunder.Scene.scene.add(directionalLight);
        Thunder.Scene.scene.add(new THREE.AmbientLight(0x00020));
        var pl = new THREE.PointLight(0xffffff, 3, 20);
        pl.y = 1;
        Thunder.Scene.scene.add(pl);
    })();

    this.addSelectionBounds = (function() {
        var line_material = new THREE.MeshBasicMaterial({
            color: 0x00ff33, opacity: 0.4, wireframe:true
        });
        materials = [];
        for(var i = 0; i < 6; i++)
            materials[i] = line_material;
        var cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2, materials ), line_material );
        cube.scale.addScalar(4);
        cube.overdraw = true;
        Thunder.Scene.scene.add( cube );
        Thunder.selector = cube;
        Thunder.selector.visible = false;
    })();

    this.addGrid = (function(size) {
        var line_material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe:true,
            opacity: 0.2
        });
        var geometry = new THREE.PlaneGeometry(25,25,12,12);
        var mesh = new THREE.Mesh(geometry, line_material);
        mesh.rotation.x = -90 * Math.PI/180;
        Thunder.Scene.scene.add(mesh);
    })();

    this.setupRenderer = (function() {
        Thunder.Scene.renderer = new THREE.WebGLRenderer({antialias:true});
        Thunder.Scene.renderer.AA = 12;
        Thunder.Scene.renderer.setSize(Thunder.Scene.width, Thunder.Scene.height);
        Thunder.Scene.container.appendChild(Thunder.Scene.renderer.domElement);
    })();

    this.addStats = (function() {
        Thunder.Scene.stats = new Stats();
        Thunder.Scene.stats.domElement.style.position = 'absolute';
        Thunder.Scene.stats.domElement.style.top = '0px';
        Thunder.Scene.container.appendChild( Thunder.Scene.stats.domElement );
    })();

    this.setupTerrain = (function() {
        buildTerrain('assets/terrain/mission1_heightMap.png','assets/terrain/mission1_diffuseMap.png');
    })();

    this.addTestObjects = (function() {
        for(var i = 0; i < Math.random() * 10; i++) {
            var mesh = new THREE.Mesh(new THREE.SphereGeometry( 1, 3, 4 ), new THREE.MeshLambertMaterial({ color:(Math.random()*0x990033)}));
            mesh.position = new THREE.Vector3(Math.random()*10, Math.random()*10 + 25, Math.random()*10);
            Thunder.Scene.scene.add( mesh );
            Thunder.Physics.handleRB( mesh );
        }
    })();

    this.addGizmo = (function() {
        Thunder.translateGizmo = new Gizmo('translate');
        Thunder.translateGizmo.init();
        Thunder.translateGizmo.hide();
    })();

    this.addSky = (function() {
        loadSkybox();
    })();
    
    this.runAnimation = (function() {
        Thunder.Scene.animate();
    })();

};

Thunder.Scene.animate = function() {
    Thunder.Scene.stats.update();
    requestAnimationFrame(Thunder.Scene.animate);
    Thunder.Scene.render();
};


Thunder.Scene.render = function() {
    this.renderer.render( this.scene, this.camera );
    this.controls.update( this.clock.getDelta() );
};
    
