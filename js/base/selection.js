    $(document).ready(document_onReady);
    var moving = false;
    function document_onReady() {
        $(document).click(onMouseClick);
        $(document).keydown(onKeyDown);
        $(document).bind("contextmenu", function(e){ return false; })

    }
    function onMouseClick(event) {
        var  mouse={};
        mouse.x = ( event.clientX / width) * 2 - 1;
        mouse.y = - ( event.clientY / height) * 2 + 1;
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        THREE.CameraHelper.__projector.unprojectVector( vector, camera );
        var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

        var intersects = ray.intersectScene( scene );

        if ( intersects.length > 0 ) {
            if ( intersects[ 0 ].object != selector ) {

                selector.position = intersects[ 0 ].object.position.clone();
                var size = new THREE.Vector3;
                size = intersects[ 0 ].object.scale.clone();
                selector.scale = size;
                selector.scale.addScalar(0.5);
                selected = intersects[ 0 ].object;
                selector.visible = true;
            }

        } else {
            selected = null;
            selector.position = scene.position.clone()
            selector.visible = false;
        }
    }
    function moveForwards() {
        camera.position.x += getVal(camera.target.x, camera.position.x) * 0.1;
        camera.position.y += getVal(camera.target.y, camera.position.y) * 0.1;
        camera.position.z += getVal(camera.target.z, camera.position.z) * 0.1;
    }
    function moveBackwards() {
        camera.position.x -= getVal(camera.target.x, camera.position.x) * 0.1;
        camera.position.y -= getVal(camera.target.y, camera.position.y) * 0.1;
        camera.position.z -= getVal(camera.target.z, camera.position.z) * 0.1;
    }
    function moveLeft() {
        //TODO
    }
    function screenToWorld()
    {
        var worldPos =  new THREE.Vector3( width/2, height/2, 1);
         THREE.CameraHelper.__projector.unprojectVector( worldPos, camera );
        return worldPos;                    
    }
    function parse(a, b) {
        if(a - b >= -15 && a - b <= 15)
            return a-b;
        else
            return getVal(a, b);
    }
    function getVal(a, b) {
        if(a > b) return 1;
        else if(a == b) return 0;
        return -1;
    }
    function onKeyDown(e) {
        switch(e.keyCode){
            case 37:
                look.h -= 5;
            break;
            case 39: 
                look.h += 5;
            break;
            case 38:
                if(look.v < 10000) look.v -= 10;
            break;
            case 40:
                if(look.v > -10000) look.v += 10;
            break;
            case 65: // move left
                
            break;
            case 68: // move right
            break;
            case 87:
                moveForwards();
            break; 
            case 83:
                moveBackwards();
            break;
        }
    }