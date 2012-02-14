    var camera, container, t = 0, scene, renderer, mousePos, selected, selector, skin, move = { h: 0, v: 0},
    look = { h: -30, v: 0};
    var width = window.innerWidth - 100, height = window.innerHeight - 100;
    var init = function() {
        container = document.createElement('div');
        document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(35, (width) / (height), 1, 2000);
        camera.target = new THREE.Vector3(0, 0, 0);
        scene = new THREE.Scene();
        scene.add(camera);
        addGrid(22);
        addSelectionBounds();
        addTestObject();
        scene.add(new THREE.AmbientLight(0xffffff, 3));

        renderer = new THREE.WebGLRenderer();
        renderer.AA = 12;
        renderer.setSize(width, height);
        
        container.appendChild(renderer.domElement);
        animate();
        camera.position = new THREE.Vector3(5,10,12);
        camera.lookAt(selector.position);
    };
    
    var addTestObject = function() {
        for(var i = 0; i < Math.random() * 10; i++) {
            var mesh = new THREE.Mesh(new THREE.SphereGeometry( 1, 3, 4 ), new THREE.MeshBasicMaterial({ color:(Math.random()*0x990033)}));
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
    
    var addGrid = function(size) {
        var line_material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.2
        });
        var geometry = new THREE.Geometry(),
        floor = -0.04,
        step = 1;
        for (var i = 0; i <= size / step * 2; i++) {
            geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-size, floor, i * step - size)));
            geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(size, floor, i * step - size)));
            geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i * step - size, floor, -size)));
            geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(i * step - size, floor, size)));
        }
        var line = new THREE.Line(geometry, line_material, THREE.LinePieces);
        scene.add(line);
        line.position.set(0, 0, 0);
    };
    var camLook = function() {
        theta = look.h * Math.PI / 180;
        camera.target.x = 180 * Math.cos( theta );
        camera.target.y = look.v;
        camera.target.z = 180 * Math.sin( theta );
        camera.lookAt( camera.target );
    }
    var render = function() {
        camLook();
        renderer.render(scene, camera);
    };
    
    var animate = function() {
        requestAnimationFrame(animate);
        render();
    };
    
    init();