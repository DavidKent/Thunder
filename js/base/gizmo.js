function Gizmo(type) { 
    this.handles = [];
    this.meshes = [];
    this.objects = [];
    this.type = type;
}
function GizmoHandle(parent, geometry, type, color) {
    this.parent = parent;
    this.model = geometry;
    this.type = type;
    this.mesh;
    this.div;
    this.color = color;
    this.selected;
}

Gizmo.prototype.init = function() {
    var loader = new THREE.JSONLoader();
    var directory = 'assets/gizmo/';
    var self = this;
    var file;
    if(this.type == 'translate')
        file = 'arrow.js';
    loader.load( directory+file, function ( geometry ) {
           var boundingBox = new THREE.JSONLoader();
           var file = 'box.js';
           boundingBox.load(directory + file, function ( box ) { 
               self.handles.push(new GizmoHandle(self, geometry, 'x', 0x00ff33));
               self.handles.push(new GizmoHandle(self, geometry, 'y', 0x0000ff));
               self.handles.push(new GizmoHandle(self, geometry, 'z', 0xff0000));
               for(var i = 0; i < 3; i++) {
                    self.handles[i].init(geometry, box);
                    self.objects.push(self.handles[i].mesh);
                    for(child in self.handles[i].mesh.children)
                        self.meshes.push(self.handles[i].mesh.children[child]);
               }
           });
    });
}

GizmoHandle.prototype.init = function(geometry, box) {
    var materials = [
        new THREE.MeshBasicMaterial({ color: this.color}),
        new THREE.MeshBasicMaterial({ opacity: 0.1, transparent:true, color: this.color})
    ];
    this.mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    var boundingBox = new THREE.Mesh(box, materials[1]);
    this.mesh.add(boundingBox);
    var flipRads = -(90 * Math.PI) / 180;
    if(this.type == 'x')
        this.mesh.rotation.x = flipRads;
    else if(this.type == 'z')
        this.mesh.rotation.z = flipRads;
    this.mesh.flipSided = true;
    for(child in this.mesh.children)
        this.mesh.children[child].gizmoHandle = this;
    Thunder.Scene.scene.add(this.mesh);
}

Gizmo.prototype.registerChange = function(handle) {
    var h = handle.mesh.position.clone();
    for(_handle in this.handles) {
        this.handles[_handle].mesh.position = h;
    }
    Thunder.selector.position = Thunder.selected.position = h;
    Thunder.selected.canFall = false;
}

Gizmo.prototype.hide = function() {
    for(obj in this.meshes) {
        this.meshes[obj].visible = false;
    }
    this.visible = false;
}

Gizmo.prototype.show = function() {
    for(obj in this.meshes) {
        this.meshes[obj].visible = true;
    }
    this.visible = true;
}

Gizmo.prototype.position = function(position) {
    for(mesh in this.objects)
        {
            this.objects[mesh].position = position.clone();
        }
}


Gizmo.prototype.selectedObject = function(pos) {
    for(handle in this.handles) {
        this.handles[handle].mesh.position = pos;
    }
}

GizmoHandle.prototype.change = function(valueX, valueY) {
    switch(this.type) {
        case 'x':
            switch(this.parent.type) { 
                case "translate" :
                    this.mesh.position.z -= valueX;
                    this.parent.registerChange(this);
                break;
            }
        break;
        case 'y':
            switch(this.parent.type) { 
                case "translate" :
                    this.mesh.position.y += valueY;
                    this.parent.registerChange(this);
                break;
            }
        break;
        case 'z':
            switch(this.parent.type) { 
                case "translate" :
                    this.mesh.position.x -= valueX;
                    this.parent.registerChange(this);
                break;
            }
        break;
    }
}

/*
function getFacePos(obj) {
    var verts = obj.geometry.vertices, newPosA = getWorldVector(obj, verts[32].position), newPosB = getWorldVector(obj, verts[38].position);
    return { a: toScreenXY(newPosA, camera), b: toScreenXY(newPosB, camera)}
}

function toScreenXY ( position, camera ) {
    var pos = position.clone();
    projScreenMat = new THREE.Matrix4();
    projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
    projScreenMat.multiplyVector3( pos );

    return { x: ( pos.x + 1 ) * $(container).width() / 2 + $(container).offset().left,
         y: ( - pos.y + 1) * $(container).height() / 2 + $(container).offset().top };
}

function getWorldVector(obj, pos) {
    var u = pos.clone();
    return obj.matrixWorld.multiplyVector3(u);
}


function buildID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}*/