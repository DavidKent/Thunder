    $(document).ready(document_onReady);
    var turning = false, startPos = {};
    function document_onReady() {
        $(document).click(onMouseClick);
        $(document).mousedown(onMouseDown);
        $(document).mouseup(onMouseUp);
       // $(document).mousemove(onMouseMove);
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
    function onMouseDown(e) {
        if(e.which == 3)
        {
            controls.activeLook = turning = true;
            
        }
    }
    function onMouseMove(e) {
        if(!turning) return;
        camera.rotation.x += (e.clientX - startPos.x) * 0.0001 * Math.PI / 180;
        camera.rotation.z -= (e.clientX - startPos.x) * 0.0001 * Math.PI / 180;
      
       // controls.lon += (e.clientY - startPos.y) / 2;
    }
    function onMouseUp(e) {
         if(e.which == 3)
        {
           controls.activeLook = turning = false;
            //$(document).css("cursor", "default");
        }
    }
   