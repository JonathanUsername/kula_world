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

private var moveDirection : Vector3 = Vector3.zero;
private var rolling : boolean = false;

private var rb: Rigidbody;
private var direction = 'down';
private var canRotate = true;
private var rotating = false;



while(true) yield CoUpdate();

function Start () {


}

function CoUpdate() {

  // Set utility direction properties
  forward = transform.forward;
  back = transform.forward * -1;
  right = transform.right;
  left = transform.right * -1;
  up = transform.up;
  down = transform.up * -1;

  var controller : CharacterController = GetComponent.<CharacterController>();

  var jumpVec;

  // if (!controller.isGrounded)
  //   print('not grounded!');

  if (true) {
    if (Input.GetButton ('Jump')) {
      jumpVec = Vector3(0, jumpSpeed, 0);
    }

    if (Input.GetKeyDown(KeyCode.RightArrow))
      yield Rotate(Quaternion.Euler(0, 90, 0));
    else if (Input.GetKeyDown(KeyCode.LeftArrow))
      yield Rotate(Quaternion.Euler(0, -90, 0));
    else if (Input.GetKeyDown(KeyCode.UpArrow) && Input.GetButton('Jump'))
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
    // moveDirection.y -= this.transform.position.y + floor.transform.position.y * Time.deltaTime;
  }

  // print(moveDirection);
  
  // Move the controller
  if (!rotating) {
    // print('moving down');
    controller.Move(moveDirection * Time.deltaTime);
  }

  var checks = 'edge' + isEdge() + ' rotatable' + isRotatable() + ' canRotate' + canRotate;
  print(checks);
  print(transform.position);

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

function OnControllerColliderHit(hit : ControllerColliderHit) {
  // print('hit');
  floor = hit.gameObject;
}

function MoveOrRotate(distance: Vector3) {
  if (isEdge() && isRotatable()) {
    rotating = true;
    this.transform.position += forward + down;
    // yield Move(forward);
    // yield Move(down);
    yield RotateWorld(left, this.transform.position);
    rotating = false;
  } else if (!isEdge()) {
    yield Move(distance);
  }
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

function RotateWorld(axis : Vector3, point : Vector3) {
  print('rotating');
  var cubes = GameObject.FindGameObjectsWithTag('Rotates');
  for (var cube in cubes) {
    // var goal = cube.transform.rotation * Quaternion.Euler(axis * 90);
    // while (cube.transform.rotation != goal) {
    //   print(cube.transform.rotation);
    //   print(goal);
      cube.transform.RotateAround(point, axis, 90);
    // }
  }
  yield;
}

function Update () {
  
}