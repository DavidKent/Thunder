var Physics = {objects: []};
var K = 0.58;
var canFall = false;
var camOffset = 3;
var firstPerson = false;
function handleTerrain(mesh) {
    Physics.mesh = mesh;
    Physics.terrain = mesh.geometry.vertices;
    Physics.size = Physics.terrain.length;
    fillStaticPos(254, 1);
}

function handleRB(mesh) {
    Physics.objects.push(mesh);
}

function getTerrainHeight(position) {
    try {
        var newPos = new THREE.Vector3(position.x / 2, position.y, position.z / 2);
        var posOnHm = newPos.sub(newPos, Physics.hmPos), 
        left, top, xN, zN, tH, bH, terrainScale = Physics.mesh.scale.x;
        left = parseInt(posOnHm.z / terrainScale);
        top = parseInt(posOnHm.x / terrainScale);
        xN = (posOnHm.x % 1) / terrainScale;
        zN = (posOnHm.z % 1) / terrainScale;      
        tH = lerp(Physics.tHeights[left][top], Physics.tHeights[left + 1][top], xN);
        bH = lerp(Physics.tHeights[left][top + 1], Physics.tHeights[left + 1][top + 1], xN);
        return lerp(tH, bH, zN);
        }
     catch(err) { return 0; }
}
 
function updatePhys() {
    if(Physics.objects.length < 1) return;
    if(Physics.mesh === undefined) return;
    if(!canFall) return;
    var ref = Physics.objects;
    for(var i = 0; i < ref.length; i++) {
        if(ref[i].yOffset === undefined)
            ref[i].yOffset = ref[i].scale.y;
        if(ref[i].yVelocity === undefined)
            ref[i].yVelocity = K;
        if(ref[i] === undefined) break;
        var y = getTerrainHeight(ref[i].position) + ref[i].yOffset, dY = ref[i].position.y;
        var _y = ref[i].velocityTarget;
        if(_y != undefined) {y = _y; 
           console.log(stError(dY, y));
        }
        var _errThreshold = 1;
        if(ref[i].yError != undefined) _errThreshold = ref[i].yError;
        if(stError(dY, y) <= _errThreshold) {
            if(ref[i].yError === undefined)
                ref[i].yVelocity *= stError(dY, y);
            else
                ref[i].yVelocity /= stError(dY, y);
            if(stError(dY, y) < 0.1) {
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
            ref[i].yVelocity = K;
        }
        if(isOnTerrain(ref[i].position) && dY > -1000)
            ref[i].position.y -= ref[i].yVelocity;
        else
            Physics.objects.splice(i, 1);
    }
}

function testJump() {
    var height = 7;
    camera.velocityTarget = getTerrainHeight(camera.position) + camera.yOffset + height, dY = camera.position.y;
    camera.yVelocity = -K;
    camera.yError = stError(camera.velocityTarget, dY) + 0.1;
}

function toggleFirstPerson() {
    if(!firstPerson)
        {
            if(camera.yOffset == undefined)
                camera.yOffset = 5;
            Physics.objects.push(camera);
            firstPerson = true;
        }
    else
    {
        var i = Physics.objects.indexOf(camera);
        if(i === undefined)
            return;
        else
            Physics.objects.splice(i, 1);
        firstPerson = false;
    }
}

function isOnTerrain(position) {
    var newPos = new THREE.Vector3(position.x / 2, position.y, position.z / 2);
    var posOnHm = newPos.sub(newPos, Physics.hmPos);
    if(posOnHm.x >= 0 && posOnHm.x < Physics.hmWidth && posOnHm.z > 0 && posOnHm.z < Physics.hmHeight)
        return true;
    return false;
}
function fillStaticPos(sqr, scale) {
    Physics.tHeights = Array2D(255,255);  
    Physics.hmWidth = (sqr - 1) * scale;
    Physics.hmHeight = (sqr - 1) * scale;
    Physics.hmPos = new THREE.Vector3(0,0,0);
    Physics.hmPos.x = -(sqr - 1) / 2 * scale;
    Physics.hmPos.z = -(sqr - 1) / 2 * scale;
    var c = parseInt(Math.sqrt(Physics.size));
    var pos = 0;
    for(var x = 0; x < c; x++)
    {
        for(var y = 0; y < c; y++)
            {
                var z = Physics.terrain[pos].position.z;
                if(z != undefined)
                    Physics.tHeights[x][y] = z;
                pos++;
            }
    }
    Physics.terrain = undefined;
    canFall = true;
}

function stError(z1, z2) {
    var mean = ( z1 + z2 ) / 2;
    return Math.sqrt( Math.pow( ( z1 - mean ), 2 ) + Math.pow( ( z2 - mean ), 2 ) / 2 );
}

function lerp(v1, v2, a) {
    return v1 + (v2 - v1) * a;
}

function Array2D(rows,cols)
{
    var u = new Array(rows);
    for (i = 0; i < u . length; ++ i)
        u[i] = new Array (cols);
        
    return u; 
}

setInterval(updatePhys, 1000 / 60);