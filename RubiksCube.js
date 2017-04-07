const CUBIE_WIDTH = 10;
const SPACING = 0.5;
const TURNING_RADIUS = (CUBIE_WIDTH + SPACING)*Math.SQRT2;

function Cube(scene) {
    this.clock = new THREE.Clock();
    
    this.corners = [];
    var frontCorners = [ 0, 1, 2, 3 ];
    var upCorners    = [ 0, 1, 4, 5 ];
    var rightCorners = [ 1, 2, 5, 6 ];
    var downCorners  = [ 2, 3, 6, 7 ];
    var leftCorners  = [ 0, 3, 4, 7 ];
    var backCorners  = [ 4, 5, 6, 7 ];
    
    this.edges = [];
    var frontEdges = [ 0, 1, 2, 3 ];
    var upEdges    = [ 0, 4, 8, 5 ];
    var rightEdges = [ 1, 5, 6, 9 ];
    var downEdges  = [ 2, 6, 7, 10 ];
    var leftEdges  = [ 3, 4, 7, 11 ];
    var backEdges  = [ 8, 9, 10, 11 ];
    
    this.centers = [];
    var frontCenters = [ 0 ];
    var upCenters = [ 1 ];
    var rightCenters = [ 2 ];
    var downCenters = [ 3 ];
    var leftCenters = [ 4 ];
    var backCenters = [ 5 ];
    
    this.offset = CUBIE_WIDTH + SPACING;

    this.turning = null;
    this.MAX_TURN_TIME = 0.5;

    this.front = "front";
    this.frontInverse = "frontInverse";
    this.up = "up";
    this.upInverse = "upInverse";
    this.right = "right";
    this.rightInverse = "rightInverse";
    this.down = "down";
    this.downInverse = "downInverse";
    this.left = "left";
    this.leftInverse = "leftInverse";
    this.back = "back";
    this.backInverse = "backInverse";

    var reverse = false;
    
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
	    x = -this.offset;
	    geometry.faces[2].color.setHex( 0xFFAA00 );
	    geometry.faces[3].color.setHex( 0xFFAA00 );
	    geometry.faces[0].color.setHex( 0x000000 );
	    geometry.faces[1].color.setHex( 0x000000 );
	} else { // Must be a right corner
	    x = this.offset
	    geometry.faces[0].color.setHex( 0xFF0000 );
	    geometry.faces[1].color.setHex( 0xFF0000 );
	    geometry.faces[2].color.setHex( 0x000000 );
	    geometry.faces[3].color.setHex( 0x000000 );
	}
	
	if(downCorners.includes(i)) {
	    y = -this.offset;
	    geometry.faces[6].color.setHex( 0x00FF00 );
	    geometry.faces[7].color.setHex( 0x00FF00 );
	    geometry.faces[4].color.setHex( 0x000000 );
	    geometry.faces[5].color.setHex( 0x000000 );
	} else { // Must be an up corner
	    y = this.offset
	    geometry.faces[4].color.setHex( 0x0000FF );
	    geometry.faces[5].color.setHex( 0x0000FF );
	    geometry.faces[6].color.setHex( 0x000000 );
	    geometry.faces[7].color.setHex( 0x000000 );
	}
	
	if(frontCorners.includes(i)) {
	    z = this.offset
	    geometry.faces[8].color.setHex( 0xFFFFFF );
	    geometry.faces[9].color.setHex( 0xFFFFFF );
	    geometry.faces[10].color.setHex( 0x000000 );
	    geometry.faces[11].color.setHex( 0x000000 );
	} else { // Must be a back corner
	    z = -this.offset
	    geometry.faces[10].color.setHex( 0xFFFF00 );
	    geometry.faces[11].color.setHex( 0xFFFF00 );
	    geometry.faces[8].color.setHex( 0x000000 );
	    geometry.faces[9].color.setHex( 0x000000 );
	}
	cubie.position.set(x, y, z);
	this.corners[i] = cubie;
    }
    
    for(var i = 0; i<this.corners.length; ++i)
	scene.add(this.corners[i]);
    
    for(var i=0; i<12; ++i) {
	var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);
	
	var cubie = new THREE.Mesh(geometry, material);
	var x = 0, y = 0, z = 0;
	if(leftEdges.includes(i)) {
	    x = -this.offset;
	    geometry.faces[2].color.setHex( 0xFFAA00 );
	    geometry.faces[3].color.setHex( 0xFFAA00 );
	    geometry.faces[0].color.setHex( 0x000000 );
	    geometry.faces[1].color.setHex( 0x000000 );
	} else if(rightEdges.includes(i)) { 
	    x = this.offset;
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
	    y = -this.offset;
	    geometry.faces[6].color.setHex( 0x00FF00 );
	    geometry.faces[7].color.setHex( 0x00FF00 );
	    geometry.faces[4].color.setHex( 0x000000 );
	    geometry.faces[5].color.setHex( 0x000000 );
	} else if(upEdges.includes(i)) {
	    y = this.offset;
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
	    z = this.offset;
	    geometry.faces[8].color.setHex( 0xFFFFFF );
	    geometry.faces[9].color.setHex( 0xFFFFFF );
	    geometry.faces[10].color.setHex( 0x000000 );
	    geometry.faces[11].color.setHex( 0x000000 );
	} else if(backEdges.includes(i)) {
	    z = -this.offset;
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
	this.edges[i] = cubie;
    }
    
    for(var i=0; i<this.edges.length; ++i)
	scene.add(this.edges[i]);
    
    for(var i=0; i<6; ++i) {
	var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);
	
	var cubie = new THREE.Mesh(geometry, material);
	var x = 0, y = 0, z = 0;
	if(leftCenters.includes(i)) {
	    x = -this.offset;
	    geometry.faces[2].color.setHex( 0xFFAA00 );
	    geometry.faces[3].color.setHex( 0xFFAA00 );
	    geometry.faces[0].color.setHex( 0x000000 );
	    geometry.faces[1].color.setHex( 0x000000 );
	} else if(rightCenters.includes(i)) { 
	    x = this.offset;
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
	    y = -this.offset;
	    geometry.faces[6].color.setHex( 0x00FF00 );
	    geometry.faces[7].color.setHex( 0x00FF00 );
	    geometry.faces[4].color.setHex( 0x000000 );
	    geometry.faces[5].color.setHex( 0x000000 );
	} else if(upCenters.includes(i)) {
	    y = this.offset;
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
	    z = this.offset;
	    geometry.faces[8].color.setHex( 0xFFFFFF );
	    geometry.faces[9].color.setHex( 0xFFFFFF );
	    geometry.faces[10].color.setHex( 0x000000 );
	    geometry.faces[11].color.setHex( 0x000000 );
	} else if(backCenters.includes(i)) {
	    z = -this.offset;
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
	this.centers[i] = cubie;
    }

    for(var i=0; i<this.centers.length; ++i)
	scene.add(this.centers[i]);

    this.startTurn = function(turn) {
	this.clock.start();
	this.turning = turn;
	if(turn.indexOf("Inverse") > -1)
	    reverse = true;
    }

    this.continueTurn = function() {
	switch(this.turning) {
	case cube.front:
	    this.frontTurn();
	    break;
	case cube.frontInverse:
	    this.frontInverseTurn();
	    break;
	case cube.up:
	    this.upTurn();
	    break;
	case cube.upInverse:
	    this.upInverseTurn();
	    break;
	case cube.right:
	    this.rightTurn();
	    break;
	case cube.rightInverse:
	    this.rightInverseTurn();
	    break;
	case cube.down:
	    this.downTurn();
	    break;
	case cube.downInverse:
	    this.downInverseTurn();
	    break;
	case cube.left:
	    this.leftTurn();
	    break;
	case cube.leftInverse:
	    this.leftInverseTurn();
	    break;
	case cube.back:
	    this.backTurn();
	    break;
	case cube.backInverse:
	    this.backInverseTurn();
	    break;
	default:
	    this.turning = null;
	    break;
	}
    }

    this.frontTurn = function() {
	this.turning = "front";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateFrontTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[0];
	    this.corners[0] = this.corners[3];
	    this.corners[3] = this.corners[2];
	    this.corners[2] = this.corners[1];
	    this.corners[1] = corner;

	    var edge = this.edges[0];
	    this.edges[0] = this.edges[3];
	    this.edges[3] = this.edges[2];
	    this.edges[2] = this.edges[1];
	    this.edges[1] = edge;
	    
	    this.centers[0].rotation.z = 0;
	    
	} else {
	    this.animateFrontTurn(t);
	}
    }

    this.frontInverseTurn = function() {
	this.turning = "frontInverse";
	console.log(reverse);
	var t = this.clock.getElapsedTime();
	
	if(reverse) {
	    var corner = this.corners[0];
	    this.corners[0] = this.corners[1];
	    this.corners[1] = this.corners[2];
	    this.corners[2] = this.corners[3];
	    this.corners[3] = corner;

	    var edge = this.edges[0];
	    this.edges[0] = this.edges[1];
	    this.edges[1] = this.edges[2];
	    this.edges[2] = this.edges[3];
	    this.edges[3] = edge;

	    this.centers[0].rotation.z = -Math.PI/2;
	    
	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateFrontTurn(0);

	} else {
	    this.animateFrontTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.upTurn = function() {
	this.turning = "up";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateUpTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[0];
	    this.corners[0] = this.corners[1];
	    this.corners[1] = this.corners[5];
	    this.corners[5] = corner;

	    var edge = this.edges[8];
	    this.edges[8] = this.edges[4];
	    this.edges[4] = this.edges[0];
	    this.edges[0] = this.edges[5];
	    this.edges[5] = edge;
	    
	    this.centers[1].rotation.y = 0;
	    
	} else {
	    this.animateUpTurn(t);
	}
    }

    this.upInverseTurn = function() {
	this.turning = "upInverse";

	var t = this.clock.getElapsedTime();

	if(reverse) {
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[5];
	    this.corners[5] = this.corners[1];
	    this.corners[1] = this.corners[0];
	    this.corners[0] = corner;

	    var edge = this.edges[8];
	    this.edges[8] = this.edges[5];
	    this.edges[5] = this.edges[0];
	    this.edges[0] = this.edges[4];
	    this.edges[4] = edge;
	    
	    this.centers[1].rotation.y = -Math.PI/2;

	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateUpTurn(0);
	    
	} else {
	    this.animateUpTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.rightTurn = function() {
	this.turning = "right";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateRightTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[1];
	    this.corners[1] = this.corners[2];
	    this.corners[2] = this.corners[6];
	    this.corners[6] = this.corners[5];
	    this.corners[5] = corner;

	    var edge = this.edges[5];
	    this.edges[5] = this.edges[1];
	    this.edges[1] = this.edges[6];
	    this.edges[6] = this.edges[9];
	    this.edges[9] = edge;
	    
	    this.centers[2].rotation.x = 0;
	    
	} else {
	    this.animateRightTurn(t);
	}
    }

    this.rightInverseTurn = function() {
	this.turning = "rightInverse";

	var t = this.clock.getElapsedTime();

	if(reverse) {

	    var corner = this.corners[1];
	    this.corners[1] = this.corners[5];
	    this.corners[5] = this.corners[6];
	    this.corners[6] = this.corners[2];
	    this.corners[2] = corner;

	    var edge = this.edges[5];
	    this.edges[5] = this.edges[9];
	    this.edges[9] = this.edges[6];
	    this.edges[6] = this.edges[1];
	    this.edges[1] = edge;

	    this.centers[2].rotation.x = -Math.PI/2;

	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateRightTurn(0);
	    
	} else {
	    this.animateRightTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.downTurn = function() {
	this.turning = "down";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateDownTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[3];
	    this.corners[3] = this.corners[7];
	    this.corners[7] = this.corners[6];
	    this.corners[6] = this.corners[2];
	    this.corners[2] = corner;

	    var edge = this.edges[2];
	    this.edges[2] = this.edges[7];
	    this.edges[7] = this.edges[10];
	    this.edges[10] = this.edges[6];
	    this.edges[6] = edge;
	    
	    this.centers[3].rotation.y = 0;
	    
	} else {
	    this.animateDownTurn(t);
	}
    }

    this.downInverseTurn = function() {
	this.turning = "downInverse";

	var t = this.clock.getElapsedTime();

	if(reverse) {
	    
	    var corner = this.corners[3];
	    this.corners[3] = this.corners[2];
	    this.corners[2] = this.corners[6];
	    this.corners[6] = this.corners[7];
	    this.corners[7] = corner;

	    var edge = this.edges[2];
	    this.edges[2] = this.edges[6];
	    this.edges[6] = this.edges[10];
	    this.edges[10] = this.edges[7];
	    this.edges[7] = edge;
	    
	    this.centers[3].rotation.y = Math.PI/2;

	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateDownTurn(0);
	    
	} else {
	    this.animateDownTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.leftTurn = function() {
	this.turning = "left";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateLeftTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[7];
	    this.corners[7] = this.corners[3];
	    this.corners[3] = this.corners[0];
	    this.corners[0] = corner;

	    var edge = this.edges[4];
	    this.edges[4] = this.edges[11];
	    this.edges[11] = this.edges[7];
	    this.edges[7] = this.edges[3];
	    this.edges[3] = edge;
	    
	    this.centers[4].rotation.x = 0;
	    
	} else {
	    this.animateLeftTurn(t);
	}
    }

    this.leftInverseTurn = function() {
	this.turning = "leftInverse";

	var t = this.clock.getElapsedTime();

	if(reverse) {
	    
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[0];
	    this.corners[0] = this.corners[3];
	    this.corners[3] = this.corners[7];
	    this.corners[7] = corner;

	    var edge = this.edges[4];
	    this.edges[4] = this.edges[3];
	    this.edges[3] = this.edges[7];
	    this.edges[7] = this.edges[11];
	    this.edges[11] = edge;
	    
	    this.centers[4].rotation.x = Math.PI/2;

	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateLeftTurn(0);
	    
	} else {
	    this.animateLeftTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.backTurn = function() {
	this.turning = "back";

	var t = this.clock.getElapsedTime();
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateBackTurn(this.MAX_TURN_TIME);
	    
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[5];
	    this.corners[5] = this.corners[6];
	    this.corners[6] = this.corners[7];
	    this.corners[7] = corner;

	    var edge = this.edges[8];
	    this.edges[8] = this.edges[9];
	    this.edges[9] = this.edges[10];
	    this.edges[10] = this.edges[11];
	    this.edges[11] = edge;
	    
	    this.centers[5].rotation.z = 0;
	    
	} else {
	    this.animateBackTurn(t);
	}
    }

    this.backInverseTurn = function() {
	this.turning = "backInverse";

	var t = this.clock.getElapsedTime();

	if(reverse) {
	    
	    var corner = this.corners[4];
	    this.corners[4] = this.corners[7];
	    this.corners[7] = this.corners[6];
	    this.corners[6] = this.corners[5];
	    this.corners[5] = corner;

	    var edge = this.edges[8];
	    this.edges[8] = this.edges[11];
	    this.edges[11] = this.edges[10];
	    this.edges[10] = this.edges[9];
	    this.edges[9] = edge;
	    
	    this.centers[5].rotation.z = Math.PI/2;

	    reverse = false;
	}
	
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateBackTurn(0);
	    
	} else {
	    this.animateBackTurn(this.MAX_TURN_TIME - t);
	}
    }

    this.animateFrontTurn = function(t) {
	var x = this.centers[0].position.x + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var y = this.centers[0].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = -t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[0].rotation.z;
	var axis = new THREE.Vector3(0, 0, 1);
	
	this.corners[0].position.x = x;
	this.corners[0].position.y = y;
	rotateAroundWorldAxis(this.corners[0], axis, dtheta);
	this.corners[1].position.x = y;
	this.corners[1].position.y = -x;
	rotateAroundWorldAxis(this.corners[1], axis, dtheta);
	this.corners[2].position.x = -x;
	this.corners[2].position.y = -y;
	rotateAroundWorldAxis(this.corners[2], axis, dtheta);
	this.corners[3].position.x = -y;
	this.corners[3].position.y = x;
	rotateAroundWorldAxis(this.corners[3], axis, dtheta);
	
	x = this.centers[0].position.x + this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	y = this.centers[0].position.y + this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[0].position.x = x;
	this.edges[0].position.y = y;
	rotateAroundWorldAxis(this.edges[0], axis, dtheta);
	this.edges[1].position.x = y;
	this.edges[1].position.y = -x;
	rotateAroundWorldAxis(this.edges[1], axis, dtheta);
	this.edges[2].position.x = -x;
	this.edges[2].position.y = -y;
	rotateAroundWorldAxis(this.edges[2], axis, dtheta);
	this.edges[3].position.x = -y;
	this.edges[3].position.y = x;
	rotateAroundWorldAxis(this.edges[3], axis, dtheta);
	
	
	this.centers[0].rotation.z = theta;
    }

    this.animateUpTurn = function(t) {
	var x = this.centers[1].position.x + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var z = this.centers[1].position.z - TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = -t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[1].rotation.y;
	var axis = new THREE.Vector3(0, 1, 0);
	
	this.corners[4].position.x = x;
	this.corners[4].position.z = z;
	rotateAroundWorldAxis(this.corners[4], axis, dtheta);
	this.corners[0].position.x = z;
	this.corners[0].position.z = -x;
	rotateAroundWorldAxis(this.corners[0], axis, dtheta);
	this.corners[1].position.x = -x;
	this.corners[1].position.z = -z;
	rotateAroundWorldAxis(this.corners[1], axis, dtheta);
	this.corners[5].position.x = -z;
	this.corners[5].position.z = x;
	rotateAroundWorldAxis(this.corners[5], axis, dtheta);

	x = this.centers[1].position.x + this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	z = this.centers[1].position.z - this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[8].position.x = x;
	this.edges[8].position.z = z;
	rotateAroundWorldAxis(this.edges[8], axis, dtheta);
	this.edges[4].position.x = z;
	this.edges[4].position.z = -x;
	rotateAroundWorldAxis(this.edges[4], axis, dtheta);
	this.edges[0].position.x = -x;
	this.edges[0].position.z = -z;
	rotateAroundWorldAxis(this.edges[0], axis, dtheta);
	this.edges[5].position.x = -z;
	this.edges[5].position.z = x;
	rotateAroundWorldAxis(this.edges[5], axis, dtheta);
	
	this.centers[1].rotation.y = theta;
    }

    this.animateRightTurn = function(t) {
	var z = this.centers[2].position.z - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var y = this.centers[2].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = -t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[2].rotation.x;
	var axis = new THREE.Vector3(1, 0, 0);
	
	this.corners[1].position.z = z;
	this.corners[1].position.y = y;
	rotateAroundWorldAxis(this.corners[1], axis, dtheta);
	this.corners[2].position.z = y;
	this.corners[2].position.y = -z;
	rotateAroundWorldAxis(this.corners[2], axis, dtheta);
	this.corners[6].position.z = -z;
	this.corners[6].position.y = -y;
	rotateAroundWorldAxis(this.corners[6], axis, dtheta);
	this.corners[5].position.z = -y;
	this.corners[5].position.y = z;
	rotateAroundWorldAxis(this.corners[5], axis, dtheta);
	
	z = this.centers[2].position.z - this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	y = this.centers[2].position.y + this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[5].position.z = z;
	this.edges[5].position.y = y;
	rotateAroundWorldAxis(this.edges[5], axis, dtheta);
	this.edges[1].position.z = y;
	this.edges[1].position.y = -z;
	rotateAroundWorldAxis(this.edges[1], axis, dtheta);
	this.edges[6].position.z = -z;
	this.edges[6].position.y = -y;
	rotateAroundWorldAxis(this.edges[6], axis, dtheta);
	this.edges[9].position.z = -y;
	this.edges[9].position.y = z;
	rotateAroundWorldAxis(this.edges[9], axis, dtheta);
	
	this.centers[2].rotation.x = theta;
    }

    this.animateDownTurn = function(t) {
	var x = this.centers[3].position.x - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var z = this.centers[3].position.z - TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[3].rotation.y;
	var axis = new THREE.Vector3(0, 1, 0);
	
	this.corners[6].position.x = x;
	this.corners[6].position.z = z;
	rotateAroundWorldAxis(this.corners[6], axis, dtheta);
	this.corners[7].position.x = z;
	this.corners[7].position.z = -x;
	rotateAroundWorldAxis(this.corners[7], axis, dtheta);
	this.corners[3].position.x = -x;
	this.corners[3].position.z = -z;
	rotateAroundWorldAxis(this.corners[3], axis, dtheta);
	this.corners[2].position.x = -z;
	this.corners[2].position.z = x;
	rotateAroundWorldAxis(this.corners[2], axis, dtheta);

	x = this.centers[3].position.x - this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	z = this.centers[3].position.z - this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[10].position.x = x;
	this.edges[10].position.z = z;
	rotateAroundWorldAxis(this.edges[10], axis, dtheta);
	this.edges[7].position.x = z;
	this.edges[7].position.z = -x;
	rotateAroundWorldAxis(this.edges[7], axis, dtheta);
	this.edges[2].position.x = -x;
	this.edges[2].position.z = -z;
	rotateAroundWorldAxis(this.edges[2], axis, dtheta);
	this.edges[6].position.x = -z;
	this.edges[6].position.z = x;
	rotateAroundWorldAxis(this.edges[6], axis, dtheta);
	
	this.centers[3].rotation.y = theta;
    }

    this.animateLeftTurn = function(t) {
	var z = this.centers[4].position.z + TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var y = this.centers[4].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[4].rotation.x;
	var axis = new THREE.Vector3(1, 0, 0);
	
	this.corners[4].position.z = z;
	this.corners[4].position.y = y;
	rotateAroundWorldAxis(this.corners[4], axis, dtheta);
	this.corners[0].position.z = y;
	this.corners[0].position.y = -z;
	rotateAroundWorldAxis(this.corners[0], axis, dtheta);
	this.corners[3].position.z = -z;
	this.corners[3].position.y = -y;
	rotateAroundWorldAxis(this.corners[3], axis, dtheta);
	this.corners[7].position.z = -y;
	this.corners[7].position.y = z;
	rotateAroundWorldAxis(this.corners[7], axis, dtheta);
	
	z = this.centers[4].position.z + this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	y = this.centers[4].position.y + this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[4].position.z = z;
	this.edges[4].position.y = y;
	rotateAroundWorldAxis(this.edges[4], axis, dtheta);
	this.edges[3].position.z = y;
	this.edges[3].position.y = -z;
	rotateAroundWorldAxis(this.edges[3], axis, dtheta);
	this.edges[7].position.z = -z;
	this.edges[7].position.y = -y;
	rotateAroundWorldAxis(this.edges[7], axis, dtheta);
	this.edges[11].position.z = -y;
	this.edges[11].position.y = z;
	rotateAroundWorldAxis(this.edges[11], axis, dtheta);
	
	this.centers[4].rotation.x = theta;
    }

    this.animateBackTurn = function(t) {
	var x = this.centers[5].position.x - TURNING_RADIUS*Math.cos( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var y = this.centers[5].position.y + TURNING_RADIUS*Math.sin( (Math.PI/2) * (3/2-t/this.MAX_TURN_TIME) );
	var theta = t/this.MAX_TURN_TIME*Math.PI/2;
	var dtheta = theta - this.centers[5].rotation.z;
	var axis = new THREE.Vector3(0, 0, 1);
	
	this.corners[5].position.x = x;
	this.corners[5].position.y = y;
	rotateAroundWorldAxis(this.corners[4], axis, dtheta);
	this.corners[6].position.x = y;
	this.corners[6].position.y = -x;
	rotateAroundWorldAxis(this.corners[5], axis, dtheta);
	this.corners[7].position.x = -x;
	this.corners[7].position.y = -y;
	rotateAroundWorldAxis(this.corners[6], axis, dtheta);
	this.corners[4].position.x = -y;
	this.corners[4].position.y = x;
	rotateAroundWorldAxis(this.corners[7], axis, dtheta);
	
	x = this.centers[5].position.x - this.offset*Math.cos( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );
	y = this.centers[5].position.y + this.offset*Math.sin( Math.PI/2 * (1 - t/this.MAX_TURN_TIME) );

	this.edges[8].position.x = x;
	this.edges[8].position.y = y;
	rotateAroundWorldAxis(this.edges[8], axis, dtheta);
	this.edges[9].position.x = y;
	this.edges[9].position.y = -x;
	rotateAroundWorldAxis(this.edges[9], axis, dtheta);
	this.edges[10].position.x = -x;
	this.edges[10].position.y = -y;
	rotateAroundWorldAxis(this.edges[10], axis, dtheta);
	this.edges[11].position.x = -y;
	this.edges[11].position.y = x;
	rotateAroundWorldAxis(this.edges[11], axis, dtheta);
	
	
	this.centers[5].rotation.z = theta;
    }
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
