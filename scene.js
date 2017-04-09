var renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
var width = window.innerWidth - 10;
var height = window.innerHeight - 20 - document.getElementById("settings").offsetHeight;
renderer.setSize(width, height);

// some variables used for scrambling the cube
var scrambling = 0;
var SCRAMBLE_TURNS = 50;
var previousScrambleTurn = null;
var oldTurnTime = 0.5;

var fieldOfView = 50;
var aspectRatio = window.innerWidth / window.innerHeight;

// How close something can get before it is no longer rendered
var nearClip = 0.1;

// How far something can get before it is no longer rendered
var farClip = 3000;

var camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearClip, farClip);
// Positioned at origin by default
// camera.position.set(0, 0, 0); 

var scene = new THREE.Scene();

// Create the cube!!!
var cube = new Cube(scene);
    
// Some variables for clicking and dragging events
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedFace = null;
var selectedCubie = null;
var downPosition = null;

function onMouseMove(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

// If the cube isn't turning, then get some info for the start of this click/drag event
function onMouseDown(event) {
    if(!cube.turning) {
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );
	
	var distance = 1000000;
	// Take the nearest intersection. Multiple occur because objects
	// exist behind the selected cubie.
	for(var i=0; i<intersects.length; ++i) {
	    if(intersects[i].distance < distance) {
		selectedCubie = intersects[i].object;
		selectedFace = cube.selectFace(intersects[i].point);
		distance = intersects[i].distance;
	    }
	}
    }
}

// If the cube isn't turning, finish a click/drag event
function onMouseUp( event ) {
    if(!cube.turning) {
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );
	
	var endFace = null;
	var endCubie = null;;
	var distance = 1000000;
	// Take the nearest intersection. Multiple occur because objects
	// exist behind the selected cubie.
	for(var i=0; i<intersects.length; ++i) {
	    if(intersects[i].distance < distance) {
		endCubie = intersects[i].object;
		endFace = cube.selectFace(intersects[i].point);
		distance = intersects[i].distance;
	    }
	}
	
	// Get the type of turn (if a valid one exists) based on the click/drag event
	var turn = cube.calculateTurn(selectedFace, selectedCubie, endFace, endCubie);
	if(turn != null)
	    cube.startTurn(turn);
	
	selectedCubie = null;
	selectedFace = null;
    }
}

var t = 0;
requestAnimationFrame(render);

// Keep track of pressed keys to process input
var keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false;}
window.onkeydown = function(e) {keys[e.keyCode]=true;}
var UP_KEY = 38;
var DOWN_KEY = 40;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var SHIFT_KEY = 16;
var F_KEY = 70;
var B_KEY = 66;
var R_KEY = 82;
var L_KEY = 76;
var D_KEY = 68;
var U_KEY = 85;
var X_KEY = 88;
var Z_KEY = 90;

// The camera's location is stored in spherical coordinates,
// because I want the camera to move on a sphere around the cube
var camera_theta = Math.PI/4;
var camera_rho = Math.PI/4;
var camera_radius = 100;
positionCamera();

var CAMERA_SPEED = 0.02;

function render() {
    // Don't allow moving of the camera during click/drag
    if(!selectedFace) {
	// Camera controls
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
	if(keys[Z_KEY] == true) {
	    camera_radius += 100*CAMERA_SPEED;
	    if(camera_radius > 400)
		camera_radius = 400;
	    positionCamera();
	}
	if(keys[X_KEY] == true) {
	    camera_radius -= 100*CAMERA_SPEED;
	    if(camera_radius < 100)
		camera_radius = 100;
	    positionCamera();
	}

	if(!scrambling) {
	    // Start turns based on input
	    // Don't start a turn while the cube is already turning, or while the cube is scrambling
	    if(!cube.turning) {
		if(keys[F_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.frontInverse);
		    else
			cube.startTurn(cube.front);
		} else if(keys[U_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.upInverse);
		    else
			cube.startTurn(cube.up);
		} else if(keys[R_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.rightInverse);
		    else
			cube.startTurn(cube.right);
		} else if(keys[D_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.downInverse);
		    else
			cube.startTurn(cube.down);
		} else if(keys[L_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.leftInverse);
		    else
			cube.startTurn(cube.left);
		} else if(keys[B_KEY] == true) {
		    if(keys[SHIFT_KEY] == true)
			cube.startTurn(cube.backInverse);
		    else
			cube.startTurn(cube.back);
		}
	    } else { // Cube is turning
		// Update the animation of the turn for this render cycle
		cube.continueTurn();
	    }
	} else { // Scrambling cube
	    continueScramble();
	}
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'mouseup', onMouseUp, false );

// Set the camera's position converting spherical coordinates to cartesian coordinates
function positionCamera() {
    camera.position.set(camera_radius*Math.cos(camera_rho)*Math.cos(camera_theta), camera_radius*Math.sin(camera_rho), camera_radius*Math.cos(camera_rho)*Math.sin(camera_theta));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

// Update the camera speed based on the camera speed slider
function updateCameraSpeed() {
    CAMERA_SPEED = document.getElementById("cameraSpeedSlider").value/1000;
}
// Add an event listener to call updateCameraSpeed when the slider is updated
document.getElementById("cameraSpeedSlider").addEventListener("input", updateCameraSpeed, false);

// Update the turn speed based on the camera speed slider
function updateTurnSpeed() {
    var time = (1000 - document.getElementById("turnSpeedSlider").value)/1000;
    cube.updateTurnTime(time);
}
// Add an event listener to call updateTurnSpeed when the slider is updated
document.getElementById("turnSpeedSlider").addEventListener("input", updateTurnSpeed, false);

// Set whether face labels are displayed based on the checkbox
function toggleFaceLabels() {
    if(document.getElementById("labelsCheckbox").checked)
	cube.showFaceLabels();
    else
	cube.hideFaceLabels();
}
// Add an event listener to call toggleFaceLabels when the checkbox is clicked
document.getElementById("labelsCheckbox").addEventListener("click", toggleFaceLabels, false);

// Start scrambling the cube
// scrambling will keep track of how many turns have been done
// When scrambling is 0, other inputs will not be processed
function scramble() {
    scrambling = 1;
    disableInputs();
    oldTurnTime = cube.MAX_TURN_TIME;
    cube.updateTurnTime(0.1);
}
document.getElementById("scrambleButton").addEventListener("click", scramble, false);

function disableInputs() {
    document.getElementById("cameraSpeedSlider").disabled = true;
    document.getElementById("turnSpeedSlider").disabled = true;
    document.getElementById("labelsCheckbox").disabled = true;
    document.getElementById("scrambleButton").disabled = true;
}

function enableInputs() {
    document.getElementById("cameraSpeedSlider").disabled = false;
    document.getElementById("turnSpeedSlider").disabled = false;
    document.getElementById("labelsCheckbox").disabled = false;
    document.getElementById("scrambleButton").disabled = false;
}

function continueScramble() {
    if(!cube.turning) {
	if( scrambling++ >= SCRAMBLE_TURNS) {
	    scrambling = 0;
	    enableInputs();
	    cube.updateTurnTime(oldTurnTime);
	    return;
	}
	switch(Math.floor(Math.random()*12)) {
	case 0: // Turn the front face
	    if(previousScrambleTurn === cube.frontInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.front;
		cube.startTurn(cube.front);
	    }
	    break;
	case 1: // Turn the up face
	    if(previousScrambleTurn === cube.upInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.up;
		cube.startTurn(cube.up);
	    }
	    break;
	case 2: // Turn the right face
	    if(previousScrambleTurn === cube.rightInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.right;
		cube.startTurn(cube.right);
	    }
	    break;
	case 3: // Turn the down face
	    if(previousScrambleTurn === cube.downInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.down;
		cube.startTurn(cube.down);
	    }
	    break;
	case 4: // Turn the left face
	    if(previousScrambleTurn === cube.leftInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.left;
		cube.startTurn(cube.left);
	    }
	    break;
	case 5: // Turn the back face
	    if(previousScrambleTurn === cube.backInverse)
		scramble--;
	    else {
		previousScrambleTurn = cube.back;
		cube.startTurn(cube.back);
	    }
	    break;
	case 6: // Turn the front face reversed
	    if(previousScrambleTurn === cube.front)
		scramble--;
	    else {
		previousScrambleTurn = cube.frontInverse;
		cube.startTurn(cube.frontInverse);
	    }
	    break;
	case 7: // Turn the up face reversed
	    if(previousScrambleTurn === cube.up)
		scramble--;
	    else {
		previousScrambleTurn = cube.upInverse;
		cube.startTurn(cube.upInverse);
	    }
	    break;
	case 8: // Turn the right face reversed
	    if(previousScrambleTurn === cube.right)
		scramble--;
	    else {
		previousScrambleTurn = cube.rightInverse;
		cube.startTurn(cube.rightInverse);
	    }
	    break;
	case 9: // Turn the down face reversed
	    if(previousScrambleTurn === cube.down)
		scramble--;
	    else {
		previousScrambleTurn = cube.downInverse;
		cube.startTurn(cube.downInverse);
	    }
	    break;
	case 10: // Turn the left face reversed
	    if(previousScrambleTurn === cube.left)
		scramble--;
	    else {
		previousScrambleTurn = cube.leftInverse;
		cube.startTurn(cube.leftInverse);
	    }
	    break;
	case 11: // Turn the back face reversed
	    if(previousScrambleTurn === cube.back)
		scramble--;
	    else {
		previousScrambleTurn = cube.backInverse;
		cube.startTurn(cube.backInverse);
	    }
	    break;
	default:
	    scramble--;
	}
    } else {
	cube.continueTurn();
    }
    
}
