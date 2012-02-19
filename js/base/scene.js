    var camera, container, t = 0, scene, renderer, selected, selector, skin, stats;
    var clock = new THREE.Clock, controls;
    var width = window.innerWidth - 100, height = window.innerHeight - 100;
    var init = function() {
        container = document.createElement('div');
        document.body.appendChild(container);
    };
    
    var addTestObject = function() {
        for(var i = 0; i < Math.random() * 10; i++) {
            var mesh = new THREE.Mesh(new THREE.SphereGeometry( 1, 3, 4 ), new THREE.MeshLambertMaterial({ color:(Math.random()*0x990033)}));
            mesh.position = new THREE.Vector3(Math.random()*10, Math.random()*10, Math.random()*10);
            scene.add( mesh );
        }
    };
    
    var addSelectionBounds = function() {
        var line_material = new THREE.MeshBasicMaterial({
            color: 0x00ff33, opacity: 0.4, wireframe:true
        });
        materials = [];
        for(var i = 0; i < 6; i++)
            materials[i] = line_material;
        var cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2, materials ), line_material );
        cube.scale.addScalar(4);
        cube.overdraw = true;
        scene.add( cube );
        selector = cube;
        selector.visible = false;
    };
    
    var runSetup = function() {
        init();
        setupCamera();
        setupScene();
        setupControls();
        addLights();
        addSelectionBounds();
        addTestObject();  
        addGrid();
        setupRenderer();
        addStats();
        animate();
        setupTerrain();
        loadSkybox();
    };
    
    var setupTerrain = function() {
        buildTerrain('assets/terrain/mission1_heightMap.png','assets/terrain/mission1_diffuseMap.png');
    };
    
    var setupControls = function() {
        controls = new THREE.FirstPersonControls( camera );
        controls.movementSpeed = 35;
        controls.lookSpeed = 0.2;
        controls.activeLook = false;
        controls.lon = -229;
        controls.lat = -29;
    };
    
    var setupScene = function() {
        scene = new THREE.Scene();
        scene.add(camera);
        camera.lookAt(scene.position);
    };
    
    var setupCamera = function() {
        camera = new THREE.PerspectiveCamera(35, (width) / (height), 1, 100000);
        camera.target = new THREE.Vector3(0, 0, 0);
        camera.position = new THREE.Vector3(20,21,-30);
    };
    
    var addStats = function() {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );
    };
    
    var addLights = function() {
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(12, 16, -13).normalize();
        directionalLight.lookAt(scene.position);
        scene.add(directionalLight);
        scene.add(new THREE.AmbientLight(0x00020));
        var pl = new THREE.PointLight(0xffffff, 3, 20);
        pl.y = 1;
        scene.add(pl);
    };
    
    var setupRenderer = function() {
        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.AA = 12;
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
    };
    
    var addGrid = function(size) {
        var line_material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe:true,
            opacity: 0.2
        });
        var geometry = new THREE.PlaneGeometry(25,25,12,12);
        var mesh = new THREE.Mesh(geometry, line_material);
        mesh.rotation.x = -90 * Math.PI/180;
        scene.add(mesh);
    };

    var render = function() {
        renderer.render(scene, camera);
        controls.update( clock.getDelta() );
    };
    
    var animate = function() {
        stats.update();
        requestAnimationFrame(animate);
        render();
    };