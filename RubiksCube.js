const CUBIE_WIDTH = 10;
const SPACING = 0.5;
const TURNING_RADIUS = (CUBIE_WIDTH + SPACING)*Math.SQRT2;

function Cube(scene) {
    // A clock is used for timing turns
    this.clock = new THREE.Clock();

    // The face distance is used to detect what face a
    // mouse click is on in the selectFace function
    var faceDistance = 3/2*CUBIE_WIDTH + SPACING;

    // Define the color of each face, and the hidden faces of the blocks
    var frontColor = 0x0000FF;
    var upColor = 0xFFFF00;
    var rightColor = 0xFF0000;
    var downColor = 0xFFFFFF;
    var leftColor = 0xFFAA00;
    var backColor = 0x00FF00;
    var internalColor = 0x000000;
    var labelColor = 0x000000;

    // Load the font for face labels
    var fontJSON = getFontJson();
    var fontLoader = new THREE.FontLoader();
    var font = fontLoader.parse(fontJSON);
    this.labelSize = 4/5*CUBIE_WIDTH;
    this.labelHeight = 0.3;
    
    // corners, edges and centers hold the pieces of the cube
    // each of the other arrays defined here define the indices
    // for the pieces which are members of the face named
    //
    // For example, front corners contains 0, 1, 2, 3 so
    // this.corners[0], this.corners[1], this.corners[2]
    // and this.corners[3] are the corners which reside
    // on the front face of the cube.
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

    // The distance between the edge of one piece
    // and the corresponding edge of the next
    this.offset = CUBIE_WIDTH + SPACING;

    // Used to disable input processing while turning
    this.turning = null;

    // The time a turn will take to execute (seconds)
    this.MAX_TURN_TIME = 0.5;

    // The available turn types which callers may use.
    // This will prevent implementing programmers from
    // making a spelling error in the string to be
    // passed in for a turn later
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

    // Whether a turn is to be counterclockwise
    // instead of clockwise
    var reverse = false;

    // The material the pieces are to be created from
    var material = new THREE.MeshBasicMaterial(
	{
	    color: downColor,
	    vertexColors: THREE.FaceColors,
	}
    );

    // Create the corners, and color them appropriately
    for(var i=0; i<8; ++i) {
	var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);
	
	var cubie = new THREE.Mesh(geometry, material);
	var x = 0, y = 0, z = 0;

	// Based on the predefined corner location arrays,
	// create the corners by the faces they are members of!
	if(leftCorners.includes(i)) {
	    x = -this.offset;
	    geometry.faces[2].color.setHex( leftColor );
	    geometry.faces[3].color.setHex( leftColor );
	    geometry.faces[0].color.setHex( internalColor );
	    geometry.faces[1].color.setHex( internalColor );
	} else { // Must be a right corner
	    x = this.offset
	    geometry.faces[0].color.setHex( rightColor );
	    geometry.faces[1].color.setHex( rightColor );
	    geometry.faces[2].color.setHex( internalColor );
	    geometry.faces[3].color.setHex( internalColor );
	}
	
	if(downCorners.includes(i)) {
	    y = -this.offset;
	    geometry.faces[6].color.setHex( downColor );
	    geometry.faces[7].color.setHex( downColor );
	    geometry.faces[4].color.setHex( internalColor );
	    geometry.faces[5].color.setHex( internalColor );
	} else { // Must be an up corner
	    y = this.offset
	    geometry.faces[4].color.setHex( upColor );
	    geometry.faces[5].color.setHex( upColor );
	    geometry.faces[6].color.setHex( internalColor );
	    geometry.faces[7].color.setHex( internalColor );
	}
	
	if(frontCorners.includes(i)) {
	    z = this.offset
	    geometry.faces[8].color.setHex( frontColor );
	    geometry.faces[9].color.setHex( frontColor );
	    geometry.faces[10].color.setHex( internalColor );
	    geometry.faces[11].color.setHex( internalColor );
	} else { // Must be a back corner
	    z = -this.offset
	    geometry.faces[10].color.setHex( backColor );
	    geometry.faces[11].color.setHex( backColor );
	    geometry.faces[8].color.setHex( internalColor );
	    geometry.faces[9].color.setHex( internalColor );
	}
	cubie.position.set(x, y, z);
	this.corners[i] = cubie;
    }

    // Add the corners to the scene
    for(var i = 0; i<this.corners.length; ++i)
	scene.add(this.corners[i]);


    // Create the edges, and color them appropriately
    for(var i=0; i<12; ++i) {
	var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);
	
	var cubie = new THREE.Mesh(geometry, material);
	var x = 0, y = 0, z = 0;

	// Based on the predefined corner location arrays,
	// create the edges by the faces they are members of!
	if(leftEdges.includes(i)) {
	    x = -this.offset;
	    geometry.faces[2].color.setHex( leftColor );
	    geometry.faces[3].color.setHex( leftColor );
	    geometry.faces[0].color.setHex( internalColor );
	    geometry.faces[1].color.setHex( internalColor );
	} else if(rightEdges.includes(i)) { 
	    x = this.offset;
	    geometry.faces[0].color.setHex( rightColor );
	    geometry.faces[1].color.setHex( rightColor );
	    geometry.faces[2].color.setHex( internalColor );
	    geometry.faces[3].color.setHex( internalColor );
	} else { // Must be in the vertical middle slice
	    x = 0;
	    geometry.faces[0].color.setHex( internalColor );
	    geometry.faces[1].color.setHex( internalColor );
	    geometry.faces[2].color.setHex( internalColor );
	    geometry.faces[3].color.setHex( internalColor );
	}
	
	if(downEdges.includes(i)) {
	    y = -this.offset;
	    geometry.faces[6].color.setHex( downColor );
	    geometry.faces[7].color.setHex( downColor );
	    geometry.faces[4].color.setHex( internalColor );
	    geometry.faces[5].color.setHex( internalColor );
	} else if(upEdges.includes(i)) {
	    y = this.offset;
	    geometry.faces[4].color.setHex( upColor );
	    geometry.faces[5].color.setHex( upColor );
	    geometry.faces[6].color.setHex( internalColor );
	    geometry.faces[7].color.setHex( internalColor );
	} else { // Must be in the horizontal middle slice
	    y = 0;
	    geometry.faces[4].color.setHex( internalColor );
	    geometry.faces[5].color.setHex( internalColor );
	    geometry.faces[6].color.setHex( internalColor );
	    geometry.faces[7].color.setHex( internalColor );
	}
	
	if(frontEdges.includes(i)) {
	    z = this.offset;
	    geometry.faces[8].color.setHex( frontColor );
	    geometry.faces[9].color.setHex( frontColor );
	    geometry.faces[10].color.setHex( internalColor );
	    geometry.faces[11].color.setHex( internalColor );
	} else if(backEdges.includes(i)) {
	    z = -this.offset;
	    geometry.faces[10].color.setHex( backColor );
	    geometry.faces[11].color.setHex( backColor );
	    geometry.faces[8].color.setHex( internalColor );
	    geometry.faces[9].color.setHex( internalColor );
	} else { // Must be in the last middle slice
	    z = 0;
	    geometry.faces[8].color.setHex( internalColor );
	    geometry.faces[9].color.setHex( internalColor );
	    geometry.faces[10].color.setHex( internalColor );
	    geometry.faces[11].color.setHex( internalColor );
	}
	cubie.position.set(x, y, z);
	this.edges[i] = cubie;
    }

    // Add the edges to the scene
    for(var i=0; i<this.edges.length; ++i)
	scene.add(this.edges[i]);

    // Create the centers, and color them appropriately
    for(var i=0; i<6; ++i) {
	var geometry = new THREE.BoxGeometry(CUBIE_WIDTH, CUBIE_WIDTH, CUBIE_WIDTH);
	
	var cubie = new THREE.Mesh(geometry, material);
	var x = 0, y = 0, z = 0;
	
	// Based on the predefined center location arrays,
	// create the edges by the faces they are members of!
	if(leftCenters.includes(i)) {
	    x = -this.offset;
	    geometry.faces[2].color.setHex( leftColor );
	    geometry.faces[3].color.setHex( leftColor );
	    geometry.faces[0].color.setHex( internalColor );
	    geometry.faces[1].color.setHex( internalColor );
	} else if(rightCenters.includes(i)) { 
	    x = this.offset;
	    geometry.faces[0].color.setHex( rightColor );
	    geometry.faces[1].color.setHex( rightColor );
	    geometry.faces[2].color.setHex( internalColor );
	    geometry.faces[3].color.setHex( internalColor );
	} else { // Must be in the vertical middle slice
	    x = 0;
	    geometry.faces[0].color.setHex( internalColor );
	    geometry.faces[1].color.setHex( internalColor );
	    geometry.faces[2].color.setHex( internalColor );
	    geometry.faces[3].color.setHex( internalColor );
	}
	
	if(downCenters.includes(i)) {
	    y = -this.offset;
	    geometry.faces[6].color.setHex( downColor );
	    geometry.faces[7].color.setHex( downColor );
	    geometry.faces[4].color.setHex( internalColor );
	    geometry.faces[5].color.setHex( internalColor );
	} else if(upCenters.includes(i)) {
	    y = this.offset;
	    geometry.faces[4].color.setHex( upColor );
	    geometry.faces[5].color.setHex( upColor );
	    geometry.faces[6].color.setHex( internalColor );
	    geometry.faces[7].color.setHex( internalColor );
	} else { // Must be in the horizontal middle slice
	    y = 0;
	    geometry.faces[4].color.setHex( internalColor );
	    geometry.faces[5].color.setHex( internalColor );
	    geometry.faces[6].color.setHex( internalColor );
	    geometry.faces[7].color.setHex( internalColor );
	}
	
	if(frontCenters.includes(i)) {
	    z = this.offset;
	    geometry.faces[8].color.setHex( frontColor );
	    geometry.faces[9].color.setHex( frontColor );
	    geometry.faces[10].color.setHex( internalColor );
	    geometry.faces[11].color.setHex( internalColor );
	} else if(backCenters.includes(i)) {
	    z = -this.offset;
	    geometry.faces[10].color.setHex( backColor );
	    geometry.faces[11].color.setHex( backColor );
	    geometry.faces[8].color.setHex( internalColor );
	    geometry.faces[9].color.setHex( internalColor );
	} else { // Must be in the last middle slice
	    z = 0;
	    geometry.faces[8].color.setHex( internalColor );
	    geometry.faces[9].color.setHex( internalColor );
	    geometry.faces[10].color.setHex( internalColor );
	    geometry.faces[11].color.setHex( internalColor );
	}
	cubie.position.set(x, y, z);
	this.centers[i] = cubie;
    }

    // Add the centers to the scene
    for(var i=0; i<this.centers.length; ++i)
	scene.add(this.centers[i]);

    // Create the face labels
    var labelMaterial = new THREE.MeshBasicMaterial({color: labelColor});
    var horizontalOffset = -this.labelSize/3;
    var verticalOffset = -this.labelSize/2;
    var outwardPosition = 3/2*CUBIE_WIDTH+0.5
    
    var frontGeometry = new THREE.TextGeometry("F", {font: font, size: this.labelSize, height: this.labelHeight});
    this.frontLabel = new THREE.Mesh(frontGeometry, labelMaterial);
    this.frontLabel.position.set(horizontalOffset, verticalOffset, outwardPosition);
    scene.add(this.frontLabel);

    var upGeometry = new THREE.TextGeometry("U", {font: font, size: this.labelSize, height: this.labelHeight});
    this.upLabel = new THREE.Mesh(upGeometry, labelMaterial);
    this.upLabel.position.set(horizontalOffset, outwardPosition, -verticalOffset);
    this.upLabel.rotation.x = -Math.PI/2;
    scene.add(this.upLabel);
    
    var rightGeometry = new THREE.TextGeometry("R", {font: font, size: this.labelSize, height: this.labelHeight});
    this.rightLabel = new THREE.Mesh(rightGeometry, labelMaterial);
    this.rightLabel.position.set(outwardPosition, verticalOffset, -horizontalOffset);
    this.rightLabel.rotation.y = Math.PI/2;
    scene.add(this.rightLabel);

    var downGeometry = new THREE.TextGeometry("D", {font: font, size: this.labelSize, height: this.labelHeight});
    this.downLabel = new THREE.Mesh(downGeometry, labelMaterial);
    this.downLabel.position.set(horizontalOffset, -outwardPosition, verticalOffset);
    this.downLabel.rotation.x = Math.PI/2;
    scene.add(this.downLabel);

    var leftGeometry = new THREE.TextGeometry("L", {font: font, size: this.labelSize, height: this.labelHeight});
    this.leftLabel = new THREE.Mesh(leftGeometry, labelMaterial);
    this.leftLabel.position.set(-outwardPosition, verticalOffset, horizontalOffset);
    this.leftLabel.rotation.y = -Math.PI/2;
    scene.add(this.leftLabel);

    var backGeometry = new THREE.TextGeometry("B", {font: font, size: this.labelSize, height: this.labelHeight});
    this.backLabel = new THREE.Mesh(backGeometry, labelMaterial);
    this.backLabel.position.set(-horizontalOffset, verticalOffset, -outwardPosition);
    this.backLabel.rotation.y = Math.PI;
    scene.add(this.backLabel);
    
    // This function takes in a turn string,
    // and starts the apropriate turn
    this.startTurn = function(turn) {
	this.clock.start();
	this.turning = turn;
	if(turn.indexOf("Inverse") > -1)
	    reverse = true;
    }

    // This function should be called each render
    // cycle until this.turning is null
    // This function updates the position of
    // the cubies being turned.
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

    // Call the animation function for a front turn
    // and switch the piece positions when finished.
    this.frontTurn = function() {
	this.turning = "front";

	var t = this.clock.getElapsedTime();

	// When the turn is complete, finish the
	// turn animation and reset setup variables
	// such as the clock, and the center's rotation
	// (which is used a reference angle during the turn)
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

    // Swap the pieces for a turn in reverse,
    // then call the regular front turn animation
    // running backwards in time to give a reverse
    // effect
    this.frontInverseTurn = function() {
	this.turning = "frontInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateFrontTurn(0);

	} else {
	    this.animateFrontTurn(this.MAX_TURN_TIME - t);
	}
    }

    // Call the animation function for an up turn
    // and switch the piece positions when finished.
    this.upTurn = function() {
	this.turning = "up";

	var t = this.clock.getElapsedTime();

	// When the turn is complete, finish the
	// turn animation and reset setup variables
	// such as the clock, and the center's rotation
	// (which is used a reference angle during the turn)
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

    // Swap the pieces for a turn in reverse,
    // then call the regular up turn animation
    // running backwards in time to give a reverse
    // effect
    this.upInverseTurn = function() {
	this.turning = "upInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateUpTurn(0);
	    
	} else {
	    this.animateUpTurn(this.MAX_TURN_TIME - t);
	}
    }

    // Call the animation function for a right turn
    // and switch the piece positions when finished.
    this.rightTurn = function() {
	this.turning = "right";

	var t = this.clock.getElapsedTime();

	// When the turn is complete, finish the
	// turn animation and reset setup variables
	// such as the clock, and the center's rotation
	// (which is used a reference angle during the turn)
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
    
    // Swap the pieces for a turn in reverse,
    // then call the regular right turn animation
    // running backwards in time to give a reverse
    // effect
    this.rightInverseTurn = function() {
	this.turning = "rightInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateRightTurn(0);
	    
	} else {
	    this.animateRightTurn(this.MAX_TURN_TIME - t);
	}
    }

    // Call the animation function for a down turn
    // and switch the piece positions when finished.
    this.downTurn = function() {
	this.turning = "down";

	var t = this.clock.getElapsedTime();
	
	// When the turn is complete, finish the
	// turn animation and reset setup variables
	// such as the clock, and the center's rotation
	// (which is used a reference angle during the turn)
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
    
    // Swap the pieces for a turn in reverse,
    // then call the regular down turn animation
    // running backwards in time to give a reverse
    // effect
    this.downInverseTurn = function() {
	this.turning = "downInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateDownTurn(0);
	    
	} else {
	    this.animateDownTurn(this.MAX_TURN_TIME - t);
	}
    }

    // Call the animation function for a left turn
    // and switch the piece positions when finished.
    this.leftTurn = function() {
	this.turning = "left";

	var t = this.clock.getElapsedTime();

	// When the turn is complete, finish the
	// turn animation and reset setup variables
	// such as the clock, and the center's rotation
	// (which is used a reference angle during the turn)
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

    // Swap the pieces for a turn in reverse,
    // then call the regular front turn animation
    // running backwards in time to give a reverse
    // effect
    this.leftInverseTurn = function() {
	this.turning = "leftInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateLeftTurn(0);
	    
	} else {
	    this.animateLeftTurn(this.MAX_TURN_TIME - t);
	}
    }

    // Call the animation function for a back turn
    // and switch the piece positions when finished.
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

    // Swap the pieces for a turn in reverse,
    // then call the regular down turn animation
    // running backwards in time to give a reverse
    // effect
    this.backInverseTurn = function() {
	this.turning = "backInverse";

	var t = this.clock.getElapsedTime();

	// Swap the turns, then turn off the reverse field
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

	// At the end of the turn, finish it
	if(t >= this.MAX_TURN_TIME) {
	    this.clock.stop();
	    this.turning = null;

	    // Finish the turn so the pieces are all in the correct spots.
	    this.animateBackTurn(0);
	    
	} else {
	    this.animateBackTurn(this.MAX_TURN_TIME - t);
	}
    }

    // The following six functions animate the actual turns by positioning the appropriate pieces
    // where they belong, t/MAX_TURN_TIME way through the turn. The angle of the appropriate center
    // piece is used for reference
    
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

    // Takes a point in R3 and returns what face
    // the point lies on, or null if it does not
    // lie on a face
    this.selectFace = function(point) {
	var x = point.x;
	var y = point.y;
	var z = point.z;
	var absX = Math.abs(Math.abs(x) - faceDistance);
	var absY = Math.abs(Math.abs(y) - faceDistance);
	var absZ = Math.abs(Math.abs(z) - faceDistance);
	switch(Math.min(absX, absY, absZ)) {
	case absX:
	    if(x < 0) {
		return "L";
	    } else {
		return "R";
	    }
	    break;
	case absY:
	    if(y < 0) {
		return "D";
	    } else {
		return "U";
	    }
	    break;
	case absZ:
	    if(z < 0) {
		return "B";
	    } else {
		return "F";
	    }
	default:
	    return null;
	}	
    }


    // This function was made to take in information about a click and drag event and determine
    // what turn should be executed.
    //
    // Returns the type of turn to execute based on selectedFace (the clicked face),
    // selectedCubie (the clicked piece), endFace (the face on which the click was released),
    // and endCubie (the piece on which the click was released)
    //
    // The function looks at selectedFace (6 valid cases), and then selectedCubie (9 valid cases).
    // Then endFace is checked to determine how to turn the cube
    //
    //     6 valid cases for corners [5 faces, 2 direcitons on same face]
    //     4 valid cases for edges [2 faces, 2 directions on same face]
    //     1 valid case for centers [click and release on the same center]
    //
    // If the end face is the same as the clicked face,
    // a comparison on the positions of endCubie and selectedCubie is made to determine which direction
    // a turn should be made
    //
    // Overall that makes 6*4*6 + 6*4*4 + 6*1*1 = 246 valid input combinations.
    // Perhaps there is some way of labelling the pieces which makes this mathematically beautiful, and
    // a smaller function, but this seems to be good enough for now.
    //
    // I have personally tested all 246 cases, and they all worked appropriately (by the end of the testing).
    //
    // The first corner, edge and center cases are documented as an example
    //
    this.calculateTurn = function(selectedFace, selectedCubie, endFace, endCubie) {
	switch(selectedFace) {
	case "F":
	    switch(selectedCubie) {
	    case this.centers[0]: // This is the first center case, the center of the front face
		if(endCubie === selectedCubie) // Valid turns for centers only occur when the drag started and ended on the center
		    return "front";
		else
		    return null;
	    case this.corners[0]: // This is the first corner case, the top left corner of the front face

		// Based on where the drag ended, determine the type of turn to move the corner to that face
		switch(endFace) {
		case "U":
		    return "leftInverse"; 
		case "L":
		    return "up";
		case "D":
		    return "left";
		case "R":
		    return "upInverse";
		    
		// If the drag ends on the same face as it started, see where the piece it ended on is
		// And make an appropriate turn if it is determinable
		case "F":
		    // Compare to position added to the cubie width / 2 to account for rounding errors
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "upInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "left";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[1]:
		switch(endFace) {
		case "U":
		    return "right";
		case "L":
		    return "up";
		case "D":
		    return "rightInverse";
		case "R":
		    return "upInverse";
		case "F":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "up";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[2]:
		switch(endFace) {
		case "U":
		    return "right";
		case "L":
		    return "downInverse";
		case "D":
		    return "rightInverse";
		case "R":
		    return "down";
		case "F":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "right";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[3]:
		switch(endFace) {
		case "U":
		    return "leftInverse";
		case "L":
		    return "downInverse";
		case "D":
		    return "left";
		case "R":
		    return "down";
		case "F":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "leftInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[0]: // This is the first edge case, the top edge of the front face

		// Based on where the drag ended, determine the type of turn to move the edge to that face
		switch(endFace) {
		case "L":
		    return "up";
		case "R":
		    return "upInverse";

                // If the drag ends on the same face as it started, see where the piece it ended on is
		// And make an appropriate turn if it is determinable
		case "F":
		    // Compare to position added to the cubie width / 2 to account for rounding errors
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "upInverse";
		    else if (endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "up";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[1]:
		switch(endFace) {
		case "U":
		    return "right";
		case "D":
		    return "rightInverse";
		case "F":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "right";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[2]:
		switch(endFace) {
		case "L":
		    return "downInverse";
		case "R":
		    return "down";
		case "F":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "down";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[3]:
		switch(endFace) {
		case "U":
		    return "leftInverse";
		case "D":
		    return "left";
		case "F":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "leftInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "left";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }
	case "U":
	    switch(selectedCubie) {
	    case this.centers[1]:
		if(endCubie = selectedCubie)
		    return "up";
		else
		    return null;
	    case this.corners[4]:
		switch(endFace) {
		case "B":
		    return "leftInverse";
		case "L":
		    return "back";
		case "F":
		    return "left";
		case "R":
		    return "backInverse";
		case "U":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "backInverse";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "left";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[5]:
		switch(endFace) {
		case "B":
		    return "right";
		case "L":
		    return "back";
		case "F":
		    return "rightInverse";
		case "R":
		    return "backInverse";
		case "U":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "back";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[1]:
		switch(endFace) {
		case "B":
		    return "right";
		case "L":
		    return "frontInverse";
		case "F":
		    return "rightInverse";
		case "R":
		    return "front";
		case "U":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "frontInverse";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "right";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[0]:
		switch(endFace) {
		case "B":
		    return "leftInverse";
		case "L":
		    return "frontInverse";
		case "F":
		    return "left";
		case "R":
		    return "front";
		case "U":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "front";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "leftInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[8]:
		switch(endFace) {
		case "L":
		    return "back";
		case "R":
		    return "backInverse";
		case "U":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "backInverse";
		    else if (endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "back";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[5]:
		switch(endFace) {
		case "B":
		    return "right";
		case "F":
		    return "rightInverse";
		case "U":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "right";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[0]:
		switch(endFace) {
		case "L":
		    return "frontInverse";
		case "R":
		    return "front";
		case "U":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "frontInverse";
		    else if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "front";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[4]:
		switch(endFace) {
		case "B":
		    return "leftInverse";
		case "F":
		    return "left";
		case "U":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "leftInverse";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "left";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }
	case "R":
	    switch(selectedCubie) {
	    case this.centers[2]:
		if(endCubie === selectedCubie)
		    return "right";
		else
		    return null;
	    case this.corners[1]:
		switch(endFace) {
		case "B":
		    return "upInverse";
		case "D":
		    return "front";
		case "F":
		    return "up";
		case "U":
		    return "frontInverse";
		case "R":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "upInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "front";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[5]:
		switch(endFace) {
		case "B":
		    return "upInverse";
		case "D":
		    return "backInverse";
		case "F":
		    return "up";
		case "U":
		    return "back";
		case "R":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "up";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "backInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[6]:
		switch(endFace) {
		case "B":
		    return "down";
		case "D":
		    return "backInverse";
		case "F":
		    return "downInverse";
		case "U":
		    return "back";
		case "R":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "back";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[2]:
		switch(endFace) {
		case "B":
		    return "down";
		case "D":
		    return "front";
		case "F":
		    return "downInverse";
		case "U":
		    return "frontInverse";
		case "R":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "frontInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[5]:
		switch(endFace) {
		case "B":
		    return "upInverse";
		case "F":
		    return "up";
		case "R":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "upInverse";
		    else if (endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "up";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[9]:
		switch(endFace) {
		case "U":
		    return "back"
		case "D":
		    return "backInverse";
		case "R":
		    if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "backInverse";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "back";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[6]:
		switch(endFace) {
		case "B":
		    return "down";
		case "F":
		    return "downInverse";
		case "R":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "downInverse";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[1]:
		switch(endFace) {
		case "U":
		    return "frontInverse";
		case "D":
		    return "front";
		case "R":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "frontInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "front";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }
	case "D":
	    switch(selectedCubie) {
	    case this.centers[3]:
		if(endCubie === selectedCubie)
		    return "down";
		else
		    return null;
	    case this.corners[3]:
		switch(endFace) {
		case "F":
		    return "leftInverse";
		case "L":
		    return "front";
		case "B":
		    return "left";
		case "R":
		    return "frontInverse";
		case "D":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "frontInverse";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "left";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[2]:
		switch(endFace) {
		case "F":
		    return "right";
		case "L":
		    return "front";
		case "B":
		    return "rightInverse";
		case "R":
		    return "frontInverse";
		case "D":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "front";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[6]:
		switch(endFace) {
		case "F":
		    return "right";
		case "L":
		    return "backInverse";
		case "B":
		    return "rightInverse";
		case "R":
		    return "back";
		case "D":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "backInverse";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "right";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[7]:
		switch(endFace) {
		case "F":
		    return "leftInverse";
		case "L":
		    return "backInverse";
		case "B":
		    return "left";
		case "R":
		    return "back";
		case "D":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "back";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "leftInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[2]:
		switch(endFace) {
		case "R":
		    return "frontInverse";
		case "L":
		    return "front";
		case "D":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "frontInverse";
		    else if (endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "front";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[6]:
		switch(endFace) {
		case "F":
		    return "right";
		case "B":
		    return "rightInverse";
		case "D":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "right";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[10]:
		switch(endFace) {
		case "R":
		    return "back";
		case "L":
		    return "backInverse";
		case "D":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "back";
		    else if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "backInverse";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[7]:
		switch(endFace) {
		case "F":
		    return "leftInverse";
		case "B":
		    return "left";
		case "D":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "leftInverse";
		    else if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "left";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }
	case "L":
	    switch(selectedCubie) {
	    case this.centers[4]:
		if(endCubie === selectedCubie)
		    return "left";
		else
		    return null;
	    case this.corners[4]:
		switch(endFace) {
		case "U":
		    return "backInverse";
		case "B":
		    return "up";
		case "D":
		    return "back";
		case "F":
		    return "upInverse"
		case "L":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "upInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "back";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[0]:
		switch(endFace) {
		case "U":
		    return "front";
		case "B":
		    return "up";
		case "D":
		    return "frontInverse";
		case "F":
		    return "upInverse";
		case "L":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "up";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "frontInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[3]:
		switch(endFace) {
		case "U":
		    return "front";
		case "B":
		    return "downInverse";
		case "D":
		    return "frontInverse";
		case "F":
		    return "down";
		case "L":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "front";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[7]:
		switch(endFace) {
		case "U":
		    return "backInverse";
		case "B":
		    return "downInverse"
		case "D":
		    return "back";
		case "F":
		    return "down";
		case "L":
		    if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "backInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[4]:
		switch(endFace) {
		case "B":
		    return "up";
		case "F":
		    return "upInverse";
		case "L":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "up";
		    else if (endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "upInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[3]:
		switch(endFace) {
		case "U":
		    return "front";
		case "D":
		    return "frontInverse";
		case "L":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "front";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "frontInverse";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[7]:
		switch(endFace) {
		case "B":
		    return "downInverse";
		case "F":
		    return "down";
		case "L":
		    if(endCubie.position.z < selectedCubie.position.z - CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.z > selectedCubie.position.z + CUBIE_WIDTH/2)
			return "down";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[11]:
		switch(endFace) {
		case "U":
		    return "backInverse";
		case "D":
		    return "back";
		case "L":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "backInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "back";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }
	case "B":
	    switch(selectedCubie) {
	    case this.centers[5]:
		if(endCubie === selectedCubie)
		    return "back";
		else
		    return null;
	    case this.corners[5]:
		switch(endFace) {
		case "U":
		    return "rightInverse";
		case "L":
		    return "upInverse";
		case "D":
		    return "right";
		case "R":
		    return "up";
		case "B":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "upInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "right";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[4]:
		switch(endFace) {
		case "U":
		    return "left";
		case "L":
		    return "upInverse";
		case "D":
		    return "leftInverse";
		case "R":
		    return "up";
		case "B":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "up";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "leftInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.corners[7]:
		switch(endFace) {
		case "U":
		    return "left";
		case "L":
		    return "down";
		case "D":
		    return "leftInverse";
		case "R":
		    return "downInverse";
		case "B":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "downInverse";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "left";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.corners[6]:
		switch(endFace) {
		case "U":
		    return "rightInverse";
		case "L":
		    return "down";
		case "D":
		    return "right";
		case "R":
		    return "downInverse";
		case "B":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "rightInverse";
		    else
			return null;		    
		default:
		    return null;
		}
	    case this.edges[8]:
		switch(endFace) {
		case "L":
		    return "upInverse";
		case "R":
		    return "up";
		case "B":
		    if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "up";
		    else if (endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "upInverse";
		    else
			return null;
		default:
		    return null;
		}
	    case this.edges[11]:
		switch(endFace) {
		case "U":
		    return "left";
		case "D":
		    return "leftInverse";
		case "B":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "left";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "leftInverse";
		    else
			return null;
		default:
		    return null;
		}

	    case this.edges[10]:
		switch(endFace) {
		case "L":
		    return "down";
		case "R":
		    return "downInverse";
		case "B":
		    if(endCubie.position.x < selectedCubie.position.x - CUBIE_WIDTH/2)
			return "down";
		    else if(endCubie.position.x > selectedCubie.position.x + CUBIE_WIDTH/2)
			return "downInverse";
		    else
			return null;		    
		default:
		    return null;
		}

	    case this.edges[9]:
		switch(endFace) {
		case "U":
		    return "rightInverse";
		case "D":
		    return "right";
		case "B":
		    if(endCubie.position.y > selectedCubie.position.y + CUBIE_WIDTH/2)
			return "rightInverse";
		    else if(endCubie.position.y < selectedCubie.position.y - CUBIE_WIDTH/2)
			return "right";
		    else
			return null;		    
		default:
		    return null;
		}
	    default:
		return null;
	    }	    
	}
    }
}

// Function taken from Three.js github issues
// Rotate an object around an arbitrary axis in world space
//
// This was needed because by default an object will rotate around
// its local axes, which change when the object rotates.
function rotateAroundWorldAxis(object, axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}
