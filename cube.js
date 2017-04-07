var renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


var fieldOfView = 35;
var aspectRatio = window.innerWidth / window.innerHeight;

// How close something can get before it is no longer rendered
var nearClip = 0.1;

// How far something can get before it is no longer rendered
var farClip = 3000;

var camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearClip, farClip);
// Positioned at origin by default
// camera.position.set(0, 0, 0); 

var scene = new THREE.Scene();

const CUBIE_WIDTH = 10;
const SPACING = 0.5;
const TURNING_RADIUS = (CUBIE_WIDTH + SPACING)*Math.SQRT2;

var corners = [];
var frontCorners = [ 0, 1, 2, 3 ];
var upCorners    = [ 0, 1, 4, 5 ];
var rightCorners = [ 1, 2, 5, 6 ];
var downCorners  = [ 2, 3, 6, 7 ];
var leftCorners  = [ 0, 3, 4, 7 ];
var backCorners  = [ 4, 5, 6, 7 ];

var edges = [];
var frontEdges = [ 0, 1, 2, 3 ];
var upEdges    = [ 0, 4, 8, 5 ];
var rightEdges = [ 1, 5, 6, 9 ];
var downEdges  = [ 2, 6, 7, 10 ];
var leftEdges  = [ 3, 4, 7, 11 ];
var backEdges  = [ 8, 9, 10, 11 ];

var centers = [];
var frontCenters = [ 0 ];
var upCenters = [ 1 ];
var rightCenters = [ 2 ];
var downCenters = [ 3 ];
var leftCenters = [ 4 ];
var backCenters = [ 5 ];

var offset = CUBIE_WIDTH + SPACING;
var startx = -(3*CUBIE_WIDTH + (2)*SPACING) / 2;

var material = new THREE.MeshBasicMaterial(
    {
	color: 0xFFFFFF,
	vertexColors: THREE.FaceColors,
    }
);

for(var i=0; i<8; ++i) {
    var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);

    var cubie = new THREE.Mesh(geometry, material);
    var x = 0, y = 0, z = 0;
    if(leftCorners.includes(i)) {
	x = -offset;
	geometry.faces[2].color.setHex( 0xFFAA00 );
	geometry.faces[3].color.setHex( 0xFFAA00 );
	geometry.faces[0].color.setHex( 0x000000 );
	geometry.faces[1].color.setHex( 0x000000 );
    } else { // Must be a right corner
	x = offset
	geometry.faces[0].color.setHex( 0xFF0000 );
	geometry.faces[1].color.setHex( 0xFF0000 );
	geometry.faces[2].color.setHex( 0x000000 );
	geometry.faces[3].color.setHex( 0x000000 );
    }
    
    if(downCorners.includes(i)) {
	y = -offset;
	geometry.faces[6].color.setHex( 0x00FF00 );
	geometry.faces[7].color.setHex( 0x00FF00 );
	geometry.faces[4].color.setHex( 0x000000 );
	geometry.faces[5].color.setHex( 0x000000 );
    } else { // Must be an up corner
	y = offset
	geometry.faces[4].color.setHex( 0x0000FF );
	geometry.faces[5].color.setHex( 0x0000FF );
	geometry.faces[6].color.setHex( 0x000000 );
	geometry.faces[7].color.setHex( 0x000000 );
    }
    
    if(frontCorners.includes(i)) {
	z = offset
	geometry.faces[8].color.setHex( 0xFFFFFF );
	geometry.faces[9].color.setHex( 0xFFFFFF );
	geometry.faces[10].color.setHex( 0x000000 );
	geometry.faces[11].color.setHex( 0x000000 );
    } else { // Must be a back corner
	z = -offset
	geometry.faces[10].color.setHex( 0xFFFF00 );
	geometry.faces[11].color.setHex( 0xFFFF00 );
	geometry.faces[8].color.setHex( 0x000000 );
	geometry.faces[9].color.setHex( 0x000000 );
    }
    cubie.position.set(x, y, z);
    corners[i] = cubie;
}

for(var i = 0; i<corners.length; ++i)
    scene.add(corners[i]);

for(var i=0; i<12; ++i) {
    var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);

    var cubie = new THREE.Mesh(geometry, material);
    var x = 0, y = 0, z = 0;
    if(leftEdges.includes(i)) {
	x = -offset;
	geometry.faces[2].color.setHex( 0xFFAA00 );
	geometry.faces[3].color.setHex( 0xFFAA00 );
	geometry.faces[0].color.setHex( 0x000000 );
	geometry.faces[1].color.setHex( 0x000000 );
    } else if(rightEdges.includes(i)) { 
	x = offset;
	geometry.faces[0].color.setHex( 0xFF0000 );
	geometry.faces[1].color.setHex( 0xFF0000 );
	geometry.faces[2].color.setHex( 0x000000 );
	geometry.faces[3].color.setHex( 0x000000 );
    } else { // Must be in the vertical middle slice
	x = 0;
	geometry.faces[0].color.setHex( 0x000000 );
	geometry.faces[1].color.setHex( 0x000000 );
	geometry.faces[2].color.setHex( 0x000000 );
	geometry.faces[3].color.setHex( 0x000000 );
    }
    
    if(downEdges.includes(i)) {
	y = -offset;
	geometry.faces[6].color.setHex( 0x00FF00 );
	geometry.faces[7].color.setHex( 0x00FF00 );
	geometry.faces[4].color.setHex( 0x000000 );
	geometry.faces[5].color.setHex( 0x000000 );
    } else if(upEdges.includes(i)) {
	y = offset;
	geometry.faces[4].color.setHex( 0x0000FF );
	geometry.faces[5].color.setHex( 0x0000FF );
	geometry.faces[6].color.setHex( 0x000000 );
	geometry.faces[7].color.setHex( 0x000000 );
    } else { // Must be in the horizontal middle slice
	y = 0;
	geometry.faces[4].color.setHex( 0x000000 );
	geometry.faces[5].color.setHex( 0x000000 );
	geometry.faces[6].color.setHex( 0x000000 );
	geometry.faces[7].color.setHex( 0x000000 );
    }
    
    if(frontEdges.includes(i)) {
	z = offset;
	geometry.faces[8].color.setHex( 0xFFFFFF );
	geometry.faces[9].color.setHex( 0xFFFFFF );
	geometry.faces[10].color.setHex( 0x000000 );
	geometry.faces[11].color.setHex( 0x000000 );
    } else if(backEdges.includes(i)) {
	z = -offset;
	geometry.faces[10].color.setHex( 0xFFFF00 );
	geometry.faces[11].color.setHex( 0xFFFF00 );
	geometry.faces[8].color.setHex( 0x000000 );
	geometry.faces[9].color.setHex( 0x000000 );
    } else { // Must be in the last middle slice
	z = 0;
	geometry.faces[8].color.setHex( 0x000000 );
	geometry.faces[9].color.setHex( 0x000000 );
	geometry.faces[10].color.setHex( 0x000000 );
	geometry.faces[11].color.setHex( 0x000000 );
    }
    cubie.position.set(x, y, z);
    edges[i] = cubie;
}

for(var i=0; i<edges.length; ++i)
    scene.add(edges[i]);

for(var i=0; i<6; ++i) {
    var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);

    var cubie = new THREE.Mesh(geometry, material);
    var x = 0, y = 0, z = 0;
    if(leftCenters.includes(i)) {
	x = -offset;
	geometry.faces[2].color.setHex( 0xFFAA00 );
	geometry.faces[3].color.setHex( 0xFFAA00 );
	geometry.faces[0].color.setHex( 0x000000 );
	geometry.faces[1].color.setHex( 0x000000 );
    } else if(rightCenters.includes(i)) { 
	x = offset;
	geometry.faces[0].color.setHex( 0xFF0000 );
	geometry.faces[1].color.setHex( 0xFF0000 );
	geometry.faces[2].color.setHex( 0x000000 );
	geometry.faces[3].color.setHex( 0x000000 );
    } else { // Must be in the vertical middle slice
	x = 0;
	geometry.faces[0].color.setHex( 0x000000 );
	geometry.faces[1].color.setHex( 0x000000 );
	geometry.faces[2].color.setHex( 0x000000 );
	geometry.faces[3].color.setHex( 0x000000 );
    }

    if(downCenters.includes(i)) {
	y = -offset;
	geometry.faces[6].color.setHex( 0x00FF00 );
	geometry.faces[7].color.setHex( 0x00FF00 );
	geometry.faces[4].color.setHex( 0x000000 );
	geometry.faces[5].color.setHex( 0x000000 );
    } else if(upCenters.includes(i)) {
	y = offset;
	geometry.faces[4].color.setHex( 0x0000FF );
	geometry.faces[5].color.setHex( 0x0000FF );
	geometry.faces[6].color.setHex( 0x000000 );
	geometry.faces[7].color.setHex( 0x000000 );
    } else { // Must be in the horizontal middle slice
	y = 0;
	geometry.faces[4].color.setHex( 0x000000 );
	geometry.faces[5].color.setHex( 0x000000 );
	geometry.faces[6].color.setHex( 0x000000 );
	geometry.faces[7].color.setHex( 0x000000 );
    }
    
    if(frontCenters.includes(i)) {
	z = offset;
	geometry.faces[8].color.setHex( 0xFFFFFF );
	geometry.faces[9].color.setHex( 0xFFFFFF );
	geometry.faces[10].color.setHex( 0x000000 );
	geometry.faces[11].color.setHex( 0x000000 );
    } else if(backCenters.includes(i)) {
	z = -offset;
	geometry.faces[10].color.setHex( 0xFFFF00 );
	geometry.faces[11].color.setHex( 0xFFFF00 );
	geometry.faces[8].color.setHex( 0x000000 );
	geometry.faces[9].color.setHex( 0x000000 );
    } else { // Must be in the last middle slice
	z = 0;
	geometry.faces[8].color.setHex( 0x000000 );
	geometry.faces[9].color.setHex( 0x000000 );
	geometry.faces[10].color.setHex( 0x000000 );
	geometry.faces[11].color.setHex( 0x000000 );
    }
    cubie.position.set(x, y, z);
    centers[i] = cubie;
}

for(var i=0; i<centers.length; ++i)
    scene.add(centers[i]);

var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(200, 500, 100);
scene.add(pointLight);

var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-200, -500, -100);
scene.add(pointLight);

var t = 0;
requestAnimationFrame(render);

var keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false;}
window.onkeydown = function(e) {keys[e.keyCode]=true;}
var UP_KEY = 38;
var DOWN_KEY = 40;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var W_KEY = 87;
var SHIFT_KEY = 16;
var S_KEY = 83;
var F_KEY = 70;
var B_KEY = 66;
var R_KEY = 82;
var L_KEY = 76;
var D_KEY = 68;
var U_KEY = 85;

var camera_theta = Math.PI/4;
var camera_rho = Math.PI/4;
var camera_radius = 100;
positionCamera();

var turning = null;
var reverse = false;
var MAX_TURN_TIME = 0.5;
var CAMERA_SPEED = 0.02;
var clock = new THREE.Clock();
function render() {
    if(keys[RIGHT_KEY] == true) {
	camera_theta += CAMERA_SPEED;
	positionCamera();
    }
    if(keys[LEFT_KEY] == true) {
	camera_theta -= CAMERA_SPEED;
	positionCamera();
    }
    if(keys[UP_KEY] == true) {
	camera_rho -= CAMERA_SPEED;
	if(camera_rho < -Math.PI/2)
	    camera_rho = -Math.PI/2;
	positionCamera();
    }
    if(keys[DOWN_KEY] == true) {
	camera_rho += CAMERA_SPEED;
	if(camera_rho > Math.PI/2)
	    camera_rho = Math.PI/2;
	positionCamera();
    }

    if(!turning) {
	if(keys[SHIFT_KEY] == true)
	    reverse = true;
	if(keys[F_KEY] == true) {
	    clock.start();
	    if(reverse)
		frontInverseTurn();
	    else
		frontTurn();
	} else if(keys[U_KEY] == true) {
	    clock.start();
	    if(reverse)
		upInverseTurn();
	    else
		upTurn();
	} else if(keys[R_KEY] == true) {
	    clock.start();
	    if(reverse)
		rightInverseTurn();
	    else
		rightTurn();
	} else if(keys[D_KEY] == true) {
	    clock.start();
	    if(reverse)
		downInverseTurn();
	    else
		downTurn();
	} else if(keys[L_KEY] == true) {
	    clock.start();
	    if(reverse)
		leftInverseTurn();
	    else
		leftTurn();
	} else if(keys[B_KEY] == true) {
	    clock.start();
	    if(reverse)
		backInverseTurn();
	    else
		backTurn();
	}
    } else {
	switch(turning) {
	case "front":
	    frontTurn();
	    break;
	case "frontInverse":
	    frontInverseTurn();
	    break;
	case "up":
	    upTurn();
	    break;
	case "upInverse":
	    upInverseTurn();
	    break;
	case "right":
	    rightTurn();
	    break;
	case "rightInverse":
	    rightInverseTurn();
	    break;
	case "down":
	    downTurn();
	    break;
	case "downInverse":
	    downInverseTurn();
	    break;
	case "left":
	    leftTurn();
	    break;
	case "leftInverse":
	    leftInverseTurn();
	    break;
	case "back":
	    backTurn();
	    break;
	case "backInverse":
	    backInverseTurn();
	    break;
	}
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function positionCamera() {
    camera.position.set(camera_radius*Math.cos(camera_rho)*Math.cos(camera_theta), camera_radius*Math.sin(camera_rho), camera_radius*Math.cos(camera_rho)*Math.sin(camera_theta));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function frontTurn() {
    turning = "front";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateFrontTurn(MAX_TURN_TIME);
	
	var corner = corners[0];
	corners[0] = corners[3];
	corners[3] = corners[2];
	corners[2] = corners[1];
	corners[1] = corner;

	var edge = edges[0];
	edges[0] = edges[3];
	edges[3] = edges[2];
	edges[2] = edges[1];
	edges[1] = edge;
	
	centers[0].rotation.z = 0;
	
    } else {
	animateFrontTurn(t);
    }
}

function frontInverseTurn() {
    turning = "frontInverse";

    var t = clock.getElapsedTime();
    
    if(reverse) {
	var corner = corners[0];
	corners[0] = corners[1];
	corners[1] = corners[2];
	corners[2] = corners[3];
	corners[3] = corner;

	var edge = edges[0];
	edges[0] = edges[1];
	edges[1] = edges[2];
	edges[2] = edges[3];
	edges[3] = edge;

	centers[0].rotation.z = -Math.PI/2;
	
	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateFrontTurn(0);

    } else {
	animateFrontTurn(MAX_TURN_TIME - t);
    }
}

function upTurn() {
    turning = "up";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateUpTurn(MAX_TURN_TIME);
	
	var corner = corners[4];
	corners[4] = corners[0];
	corners[0] = corners[1];
	corners[1] = corners[5];
	corners[5] = corner;

	var edge = edges[8];
	edges[8] = edges[4];
	edges[4] = edges[0];
	edges[0] = edges[5];
	edges[5] = edge;
	
	centers[1].rotation.y = 0;
	
    } else {
	animateUpTurn(t);
    }
}

function upInverseTurn() {
    turning = "upInverse";

    var t = clock.getElapsedTime();

    if(reverse) {
	var corner = corners[4];
	corners[4] = corners[5];
	corners[5] = corners[1];
	corners[1] = corners[0];
	corners[0] = corner;

	var edge = edges[8];
	edges[8] = edges[5];
	edges[5] = edges[0];
	edges[0] = edges[4];
	edges[4] = edge;
	
	centers[1].rotation.y = -Math.PI/2;

	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateUpTurn(0);
		
    } else {
	animateUpTurn(MAX_TURN_TIME - t);
    }
}

function rightTurn() {
    turning = "right";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateRightTurn(MAX_TURN_TIME);
	
	var corner = corners[1];
	corners[1] = corners[2];
	corners[2] = corners[6];
	corners[6] = corners[5];
	corners[5] = corner;

	var edge = edges[5];
	edges[5] = edges[1];
	edges[1] = edges[6];
	edges[6] = edges[9];
	edges[9] = edge;
	
	centers[2].rotation.x = 0;
	
    } else {
	animateRightTurn(t);
    }
}

function rightInverseTurn() {
    turning = "rightInverse";

    var t = clock.getElapsedTime();

    if(reverse) {

	var corner = corners[1];
	corners[1] = corners[5];
	corners[5] = corners[6];
	corners[6] = corners[2];
	corners[2] = corner;

	var edge = edges[5];
	edges[5] = edges[9];
	edges[9] = edges[6];
	edges[6] = edges[1];
	edges[1] = edge;

	centers[2].rotation.x = -Math.PI/2;

	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateRightTurn(0);
	
    } else {
	animateRightTurn(MAX_TURN_TIME - t);
    }
}

function downTurn() {
    turning = "down";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateDownTurn(MAX_TURN_TIME);
	
	var corner = corners[3];
	corners[3] = corners[7];
	corners[7] = corners[6];
	corners[6] = corners[2];
	corners[2] = corner;

	var edge = edges[2];
	edges[2] = edges[7];
	edges[7] = edges[10];
	edges[10] = edges[6];
	edges[6] = edge;
	
	centers[3].rotation.y = 0;
	
    } else {
	animateDownTurn(t);
    }
}

function downInverseTurn() {
    turning = "downInverse";

    var t = clock.getElapsedTime();

    if(reverse) {
	
	var corner = corners[3];
	corners[3] = corners[2];
	corners[2] = corners[6];
	corners[6] = corners[7];
	corners[7] = corner;

	var edge = edges[2];
	edges[2] = edges[6];
	edges[6] = edges[10];
	edges[10] = edges[7];
	edges[7] = edge;
	
	centers[3].rotation.y = Math.PI/2;

	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateDownTurn(0);
	
    } else {
	animateDownTurn(MAX_TURN_TIME - t);
    }
}

function leftTurn() {
    turning = "left";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateLeftTurn(MAX_TURN_TIME);
	
	var corner = corners[4];
	corners[4] = corners[7];
	corners[7] = corners[3];
	corners[3] = corners[0];
	corners[0] = corner;

	var edge = edges[4];
	edges[4] = edges[11];
	edges[11] = edges[7];
	edges[7] = edges[3];
	edges[3] = edge;
	
	centers[4].rotation.x = 0;
	
    } else {
	animateLeftTurn(t);
    }
}

function leftInverseTurn() {
    turning = "leftInverse";

    var t = clock.getElapsedTime();

    if(reverse) {
	
	var corner = corners[4];
	corners[4] = corners[0];
	corners[0] = corners[3];
	corners[3] = corners[7];
	corners[7] = corner;

	var edge = edges[4];
	edges[4] = edges[3];
	edges[3] = edges[7];
	edges[7] = edges[11];
	edges[11] = edge;
	
	centers[4].rotation.x = Math.PI/2;

	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateLeftTurn(0);
	
    } else {
	animateLeftTurn(MAX_TURN_TIME - t);
    }
}

function backTurn() {
    turning = "back";

    var t = clock.getElapsedTime();
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateBackTurn(MAX_TURN_TIME);
	
	var corner = corners[4];
	corners[4] = corners[5];
	corners[5] = corners[6];
	corners[6] = corners[7];
	corners[7] = corner;

	var edge = edges[8];
	edges[8] = edges[9];
	edges[9] = edges[10];
	edges[10] = edges[11];
	edges[11] = edge;
	
	centers[5].rotation.z = 0;
	
    } else {
	animateBackTurn(t);
    }
}

function backInverseTurn() {
    turning = "backInverse";

    var t = clock.getElapsedTime();

    if(reverse) {
	
	var corner = corners[4];
	corners[4] = corners[7];
	corners[7] = corners[6];
	corners[6] = corners[5];
	corners[5] = corner;

	var edge = edges[8];
	edges[8] = edges[11];
	edges[11] = edges[10];
	edges[10] = edges[9];
	edges[9] = edge;
	
	centers[5].rotation.z = Math.PI/2;

	reverse = false;
    }
    
    if(t >= MAX_TURN_TIME) {
	clock.stop();
	turning = null;

	// Finish the turn so the pieces are all in the correct spots.
	animateBackTurn(0);
	
    } else {
	animateBackTurn(MAX_TURN_TIME - t);
    }
}

function animateFrontTurn(t) {
    var x = centers[0].position.x + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var y = centers[0].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = -t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[0].rotation.z;
    var axis = new THREE.Vector3(0, 0, 1);
	
    corners[0].position.x = x;
    corners[0].position.y = y;
    rotateAroundWorldAxis(corners[0], axis, dtheta);
    corners[1].position.x = y;
    corners[1].position.y = -x;
    rotateAroundWorldAxis(corners[1], axis, dtheta);
    corners[2].position.x = -x;
    corners[2].position.y = -y;
    rotateAroundWorldAxis(corners[2], axis, dtheta);
    corners[3].position.x = -y;
    corners[3].position.y = x;
    rotateAroundWorldAxis(corners[3], axis, dtheta);
    
    x = centers[0].position.x + offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    y = centers[0].position.y + offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[0].position.x = x;
    edges[0].position.y = y;
    rotateAroundWorldAxis(edges[0], axis, dtheta);
    edges[1].position.x = y;
    edges[1].position.y = -x;
    rotateAroundWorldAxis(edges[1], axis, dtheta);
    edges[2].position.x = -x;
    edges[2].position.y = -y;
    rotateAroundWorldAxis(edges[2], axis, dtheta);
    edges[3].position.x = -y;
    edges[3].position.y = x;
    rotateAroundWorldAxis(edges[3], axis, dtheta);
    
    
    centers[0].rotation.z = theta;
}

function animateUpTurn(t) {
    var x = centers[1].position.x + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var z = centers[1].position.z - TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = -t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[1].rotation.y;
    var axis = new THREE.Vector3(0, 1, 0);
    
    corners[4].position.x = x;
    corners[4].position.z = z;
    rotateAroundWorldAxis(corners[4], axis, dtheta);
    corners[0].position.x = z;
    corners[0].position.z = -x;
    rotateAroundWorldAxis(corners[0], axis, dtheta);
    corners[1].position.x = -x;
    corners[1].position.z = -z;
    rotateAroundWorldAxis(corners[1], axis, dtheta);
    corners[5].position.x = -z;
    corners[5].position.z = x;
    rotateAroundWorldAxis(corners[5], axis, dtheta);

    x = centers[1].position.x + offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    z = centers[1].position.z - offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[8].position.x = x;
    edges[8].position.z = z;
    rotateAroundWorldAxis(edges[8], axis, dtheta);
    edges[4].position.x = z;
    edges[4].position.z = -x;
    rotateAroundWorldAxis(edges[4], axis, dtheta);
    edges[0].position.x = -x;
    edges[0].position.z = -z;
    rotateAroundWorldAxis(edges[0], axis, dtheta);
    edges[5].position.x = -z;
    edges[5].position.z = x;
    rotateAroundWorldAxis(edges[5], axis, dtheta);
    
    centers[1].rotation.y = theta;
}

function animateRightTurn(t) {
    var z = centers[2].position.z - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var y = centers[2].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = -t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[2].rotation.x;
    var axis = new THREE.Vector3(1, 0, 0);
	
    corners[1].position.z = z;
    corners[1].position.y = y;
    rotateAroundWorldAxis(corners[1], axis, dtheta);
    corners[2].position.z = y;
    corners[2].position.y = -z;
    rotateAroundWorldAxis(corners[2], axis, dtheta);
    corners[6].position.z = -z;
    corners[6].position.y = -y;
    rotateAroundWorldAxis(corners[6], axis, dtheta);
    corners[5].position.z = -y;
    corners[5].position.y = z;
    rotateAroundWorldAxis(corners[5], axis, dtheta);
    
    z = centers[2].position.z - offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    y = centers[2].position.y + offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[5].position.z = z;
    edges[5].position.y = y;
    rotateAroundWorldAxis(edges[5], axis, dtheta);
    edges[1].position.z = y;
    edges[1].position.y = -z;
    rotateAroundWorldAxis(edges[1], axis, dtheta);
    edges[6].position.z = -z;
    edges[6].position.y = -y;
    rotateAroundWorldAxis(edges[6], axis, dtheta);
    edges[9].position.z = -y;
    edges[9].position.y = z;
    rotateAroundWorldAxis(edges[9], axis, dtheta);
    
    centers[2].rotation.x = theta;
}

function animateDownTurn(t) {
    var x = centers[3].position.x - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var z = centers[3].position.z - TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[3].rotation.y;
    var axis = new THREE.Vector3(0, 1, 0);
    
    corners[6].position.x = x;
    corners[6].position.z = z;
    rotateAroundWorldAxis(corners[6], axis, dtheta);
    corners[7].position.x = z;
    corners[7].position.z = -x;
    rotateAroundWorldAxis(corners[7], axis, dtheta);
    corners[3].position.x = -x;
    corners[3].position.z = -z;
    rotateAroundWorldAxis(corners[3], axis, dtheta);
    corners[2].position.x = -z;
    corners[2].position.z = x;
    rotateAroundWorldAxis(corners[2], axis, dtheta);

    x = centers[3].position.x - offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    z = centers[3].position.z - offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[10].position.x = x;
    edges[10].position.z = z;
    rotateAroundWorldAxis(edges[10], axis, dtheta);
    edges[7].position.x = z;
    edges[7].position.z = -x;
    rotateAroundWorldAxis(edges[7], axis, dtheta);
    edges[2].position.x = -x;
    edges[2].position.z = -z;
    rotateAroundWorldAxis(edges[2], axis, dtheta);
    edges[6].position.x = -z;
    edges[6].position.z = x;
    rotateAroundWorldAxis(edges[6], axis, dtheta);
    
    centers[3].rotation.y = theta;
}

function animateLeftTurn(t) {
    var z = centers[4].position.z + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var y = centers[4].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[4].rotation.x;
    var axis = new THREE.Vector3(1, 0, 0);
	
    corners[4].position.z = z;
    corners[4].position.y = y;
    rotateAroundWorldAxis(corners[4], axis, dtheta);
    corners[0].position.z = y;
    corners[0].position.y = -z;
    rotateAroundWorldAxis(corners[0], axis, dtheta);
    corners[3].position.z = -z;
    corners[3].position.y = -y;
    rotateAroundWorldAxis(corners[3], axis, dtheta);
    corners[7].position.z = -y;
    corners[7].position.y = z;
    rotateAroundWorldAxis(corners[7], axis, dtheta);
    
    z = centers[4].position.z + offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    y = centers[4].position.y + offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[4].position.z = z;
    edges[4].position.y = y;
    rotateAroundWorldAxis(edges[4], axis, dtheta);
    edges[3].position.z = y;
    edges[3].position.y = -z;
    rotateAroundWorldAxis(edges[3], axis, dtheta);
    edges[7].position.z = -z;
    edges[7].position.y = -y;
    rotateAroundWorldAxis(edges[7], axis, dtheta);
    edges[11].position.z = -y;
    edges[11].position.y = z;
    rotateAroundWorldAxis(edges[11], axis, dtheta);
    
    centers[4].rotation.x = theta;
}

function animateBackTurn(t) {
    var x = centers[5].position.x - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var y = centers[5].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/MAX_TURN_TIME) );
    var theta = t/MAX_TURN_TIME*Math.PI/2;
    var dtheta = theta - centers[5].rotation.z;
    var axis = new THREE.Vector3(0, 0, 1);
	
    corners[5].position.x = x;
    corners[5].position.y = y;
    rotateAroundWorldAxis(corners[4], axis, dtheta);
    corners[6].position.x = y;
    corners[6].position.y = -x;
    rotateAroundWorldAxis(corners[5], axis, dtheta);
    corners[7].position.x = -x;
    corners[7].position.y = -y;
    rotateAroundWorldAxis(corners[6], axis, dtheta);
    corners[4].position.x = -y;
    corners[4].position.y = x;
    rotateAroundWorldAxis(corners[7], axis, dtheta);
    
    x = centers[5].position.x - offset*Math.cos( Math.PI/2 * (1 - t/MAX_TURN_TIME) );
    y = centers[5].position.y + offset*Math.sin( Math.PI/2 * (1 - t/MAX_TURN_TIME) );

    edges[8].position.x = x;
    edges[8].position.y = y;
    rotateAroundWorldAxis(edges[8], axis, dtheta);
    edges[9].position.x = y;
    edges[9].position.y = -x;
    rotateAroundWorldAxis(edges[9], axis, dtheta);
    edges[10].position.x = -x;
    edges[10].position.y = -y;
    rotateAroundWorldAxis(edges[10], axis, dtheta);
    edges[11].position.x = -y;
    edges[11].position.y = x;
    rotateAroundWorldAxis(edges[11], axis, dtheta);
    
    
    centers[5].rotation.z = theta;
}

// Function taken from Three.js github issues
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}
