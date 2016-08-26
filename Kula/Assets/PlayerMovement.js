#pragma strict

import System.Collections.Generic;

var speed : float = 0.1;
var rotationSpeed : float = 1000.0;
var jumpSpeed : float = 1.0;
var gravity : float;
var floor : GameObject;

var forward : Vector3;
var back : Vector3;
var right : Vector3;
var left : Vector3;
var up : Vector3;
var down : Vector3;

var GameOver : GameOver;
var Win : Win;

private var moveDirection : Vector3 = Vector3.zero;
private var rolling : boolean = false;

private var rb: Rigidbody;
private var direction = 'down';
private var canRotate = true;
private var rotating = false;
private var fallingCount : float = 0;



while(true) yield CoUpdate();

function Start () {


}

function CoUpdate() {

  if (Win.gameObject.activeSelf)
    return;

  // Set utility direction properties
  forward = transform.forward;
  back = transform.forward * -1;
  right = transform.right;
  left = transform.right * -1;
  up = transform.up;
  down = transform.up * -1;

  var controller : CharacterController = GetComponent.<CharacterController>();

  var jumpVec;

  // if (!controller.isGrounded) print('not grounded!');
  // else print('grounded');

  if (controller.isGrounded) {
    fallingCount = 0;
    if (Input.GetButton ('Jump')) {
      jumpVec = Vector3(0, jumpSpeed, 0);
    }

    if (Input.GetKeyDown(KeyCode.RightArrow))
      yield Rotate(Quaternion.Euler(0, 90, 0));
    else if (Input.GetKeyDown(KeyCode.LeftArrow))
      yield Rotate(Quaternion.Euler(0, -90, 0));
    else if (Input.GetKeyDown(KeyCode.UpArrow) && Input.GetButton('Jump') && canJump())
      yield Move(forward * 2 + Vector3(0, 1, 0));
    else if (Input.GetKeyDown(KeyCode.UpArrow))
      yield MoveOrRotate(forward);
    else if (Input.GetKeyDown(KeyCode.DownArrow))
      yield MoveOrRotate(forward * -1);
    else 
      yield;

  }

  // Apply gravity
  if (direction == 'down') {
    moveDirection += Vector3.down * gravity * Time.deltaTime;
  }
  
  // Move the controller
  if (!rotating) {
    fallingCount += Time.deltaTime * 1;
    controller.Move(moveDirection * Time.deltaTime);
  }

  if (fallingCount > 3) {
    GameOver.TriggerGameOver();
  }

  // var checks = 'pos' + transform.position + ' edge' + isEdge() + ' rotatable' + isRotatable() + ' isRotatableWall' + isRotatableWall();
  // print(checks);

}

function canJump() {
  var dist = 2;
  var rc = Physics.Raycast(transform.position, (forward * 2) + up, dist);
  return !rc;
}

function isEdge() {
  var dist = 1;
  var rc = Physics.Raycast(transform.position + forward, down, dist);
  return !rc;
}

function isRotatable() {
  // We need to test if there is a block right and left of the ball. 
  // If there isn't, but it's still an edge, we can rotate
  var dist = 1;
  var rc1 = Physics.Raycast(transform.position + right, down, dist);
  var rc2 = Physics.Raycast(transform.position + left, down, dist);
  return !rc1 && !rc2;
}

function isRotatableWall() {
  // We need to test if forward but !left + fwd && !right + fwd. 
  var dist = 1;
  var r = Physics.Raycast(transform.position + right, forward, dist);
  var l = Physics.Raycast(transform.position + left, forward, dist);
  var f = Physics.Raycast(transform.position, forward, dist);
  return f && !r && !l;
}

function centreBall() {
  var pt = transform.position;
  transform.position = new Vector3(
    Mathf.Round(pt.x), 
    Mathf.Round(pt.y), 
    Mathf.Round(pt.z)
  );
}

function OnControllerColliderHit(hit : ControllerColliderHit) {
  floor = hit.gameObject;
}

function MoveOrRotate(distance: Vector3) {
  var e = isEdge();
  var r = isRotatable();
  var rw = isRotatableWall();

  if (rotating) return;

  if (e && r && !rw) {
    rotating = true;
    var pivot = this.transform.position;
    var corner = this.transform.position + (forward + down)/2;
    yield Move(forward/2);
    // yield Move(down);
    yield RotateWorld(left, corner);
    yield Move(forward/2);
    // yield RotateWorld(left, this.transform.position);
  } else if (rw) {
    rotating = true;
    // Rotate backwards if wall, ie. round right axis
    yield RotateWorld(right, this.transform.position);
  } else if (!e) {
    yield Move(distance);
  }

  centreBall();
}

function Move(distance : Vector3) {
  var pt = this.transform;
  var goal = pt.position + distance;
  while (pt.position != goal) {
    pt.position = Vector3.MoveTowards(pt.position, goal, speed * Time.deltaTime);
    yield;
  }
}

function Rotate(rotation : Quaternion) {
  var pt = this.transform;
  var goal = pt.rotation * rotation;
  while (pt.rotation != goal) {
    pt.rotation = Quaternion.RotateTowards(pt.rotation, goal, 10);
    yield;
  }
}

function RotateCube(cube : GameObject, axis: Vector3, point: Vector3, last: boolean) {
  // see: http://answers.unity3d.com/questions/29110/easing-a-rotation-of-rotate-around.html

  var rotateAmount : int = 90;
  var rotateTime : float = 0.5;
  var step : float = 0.0; // non-smoothed
  var rate : float = 1.0/rotateTime; // amount to increase non-smooth step by
  var smoothStep : float = 0.0; // smooth step this time
  var lastStep : float = 0.0; // smooth step last time

  var goal = Quaternion.Euler(axis * rotateAmount) * cube.transform.rotation;
  while (step < 1.0) {
    step += Time.deltaTime * rate; // increase the step
    smoothStep = Mathf.SmoothStep(0.0, 1.0, step); // get the smooth step

    if (cube) // Check it still exists
      cube.transform.RotateAround(point, axis, rotateAmount * (smoothStep - lastStep));

    lastStep = smoothStep; // store the smooth step
    yield;
  }

  if (step > 1.0) {
    transform.RotateAround(point, axis, rotateAmount * (1.0 - lastStep));
  }

  // check for last coroutine to have finished
  if (last) {
    rotating = false;
  }
}

function RotateWorld(axis : Vector3, point : Vector3) {
  var cubes = GameObject.FindGameObjectsWithTag('Rotates');
  for (var i : int = 0; i < cubes.Length; i++) {
    var last = i == cubes.Length - 1;
    RotateCube(cubes[i], axis, point, last);
  }
  while (rotating) yield;
}

function Update () {
  
}