Thunder.Physics.K = 0.58;
Thunder.Physics.canFall = false;
Thunder.Player.camOffset = 3;
Thunder.Player.firstPerson = false;
Thunder.Physics.handleTerrain = function(mesh) {
    this.mesh = mesh;
    this.terrain = mesh.geometry.vertices;
    this.size = Thunder.Physics.terrain.length;
    this.fillStaticPos(254, 1);
}

Thunder.Physics.handleRB = function(mesh) {
    this.rigidBodies.push(mesh);
}

Thunder.Physics.getTerrainHeight = function(position) {
    try {
        var newPos = new THREE.Vector3(position.x / 2, position.y, position.z / 2);
        var posOnHm = newPos.sub(newPos, this.hmPos), 
        left, top, xN, zN, tH, bH, terrainScale = this.mesh.scale.x;
        left = parseInt(posOnHm.z / terrainScale);
        top = parseInt(posOnHm.x / terrainScale);
        xN = (posOnHm.x % 1) / terrainScale;
        zN = (posOnHm.z % 1) / terrainScale;      
        tH = Thunder.Utils.lerp(this.tHeights[left][top], this.tHeights[left + 1][top], xN);
        bH = Thunder.Utils.lerp(this.tHeights[left][top + 1], this.tHeights[left + 1][top + 1], xN);
        return Thunder.Utils.lerp(tH, bH, zN);
        }
     catch(err) { return 0; }
}
 
Thunder.Physics.updatePhys = function(self) {
    if(self.rigidBodies.length < 1) return;
    if(self.mesh === undefined) return;
    if(!Thunder.Physics.canFall) return;
    var ref = self.rigidBodies;
    for(var i = 0; i < ref.length; i++) {
        if(ref[i].yOffset === undefined)
            ref[i].yOffset = ref[i].scale.y;
        if(ref[i].yVelocity === undefined)
            ref[i].yVelocity = Thunder.Physics.K;
        if(ref[i] === undefined) break;
        if(ref[i].canFall != undefined)
            if(ref[i].canFall == false)
                continue;
        var y = self.getTerrainHeight(ref[i].position) + ref[i].yOffset, dY = ref[i].position.y;
        var _y = ref[i].velocityTarget;
        if(_y != undefined) y = _y; 
        var _errThreshold = 1;
        if(ref[i].yError != undefined) _errThreshold = ref[i].yError;
        if(Thunder.Utils.stError(dY, y) <= _errThreshold) {
            if(ref[i].yError === undefined)
                ref[i].yVelocity *= Thunder.Utils.stError(dY, y);
            else
                ref[i].yVelocity /= Thunder.Utils.stError(dY, y);
            if(Thunder.Utils.stError(dY, y) < 0.1) {
                if(_y != undefined) {
                    ref[i].velocityTarget = ref[i].yError = ref[i].yVelocity = undefined;
                }
                continue;
            }
            if(dY < y && _y === undefined)
                ref[i].position.y = y;
        }
        else
        {
            ref[i].yVelocity = Thunder.Physics.K;
        }
        if(self.isOnTerrain(ref[i].position) && dY > -1000)
            ref[i].position.y -= ref[i].yVelocity;
        else
            selfobjects.splice(i, 1);
    }
}

Thunder.Player.testJump = function() {
    var height = 7;
    Thunder.Scene.camera.velocityTarget = this.getTerrainHeight(Thunder.Scene.camera.position) + Thunder.Scene.camera.yOffset + height, dY = Thunder.Scene.camera.position.y;
    Thunder.Scene.camera.yVelocity = -Thunder.Physics.K;
    Thunder.Scene.camera.yError = Thunder.Utils.stError(Thunder.Scene.camera.velocityTarget, dY) + 0.1;
}

Thunder.Player.toggleFirstPerson = function() {
    if(!Thunder.Player.firstPerson)
        {
            if(Thunder.Scene.camera.yOffset == undefined)
                Thunder.Scene.camera.yOffset = Thunder.Player.camOffset;
            Thunder.Physics.rigidBodies.push(Thunder.Scene.camera);
            firstPerson = true;
        }
    else
    {
        var i = Thunder.Physics.rigidBodies.indexOf(Thunder.Scene.camera);
        if(i === undefined)
            return;
        else
            this.objects.splice(i, 1);
        firstPerson = false;
    }
}

Thunder.Physics.isOnTerrain = function(position) {
    var newPos = new THREE.Vector3(position.x / 2, position.y, position.z / 2);
    var posOnHm = newPos.sub(newPos, this.hmPos);
    if(posOnHm.x >= 0 && posOnHm.x < this.hmWidth && posOnHm.z > 0 && posOnHm.z < this.hmHeight)
        return true;
    return false;
}
Thunder.Physics.fillStaticPos = function(sqr, scale) {
    this.tHeights = Thunder.Utils.Array2D(255,255);  
    this.hmWidth = (sqr - 1) * scale;
    this.hmHeight = (sqr - 1) * scale;
    this.hmPos = new THREE.Vector3(0,0,0);
    this.hmPos.x = -(sqr - 1) / 2 * scale;
    this.hmPos.z = -(sqr - 1) / 2 * scale;
    var c = parseInt(Math.sqrt(this.size));
    var pos = 0;
    for(var x = 0; x < c; x++)
    {
        for(var y = 0; y < c; y++)
            {
                var z = this.terrain[pos].position.z;
                if(z != undefined)
                    this.tHeights[x][y] = z;
                pos++;
            }
    }
    this.terrain = undefined;
    Thunder.Physics.canFall = true;
}



setInterval(Thunder.Physics.updatePhys, 1000 / 60, Thunder.Physics);