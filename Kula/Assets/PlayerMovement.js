#pragma strict

var speed : float = 0.1;
var rotationSpeed : float = 1000.0;
var jumpSpeed : float = 1.0;
var gravity : float = 1.0;

private var moveDirection : Vector3 = Vector3.zero;
private var rolling : boolean = false;


while(true) yield CoUpdate();

function Start () {

}

function CoUpdate() {

  var controller : CharacterController = GetComponent.<CharacterController>();

  var jumpVec;

  if (controller.isGrounded) {
    if (Input.GetButton ('Jump')) {
      jumpVec = Vector3(0, jumpSpeed, 0);
    }

    if (Input.GetKeyDown(KeyCode.RightArrow))
      yield Rotate(Quaternion.Euler(0, 90, 0));
    else if (Input.GetKeyDown(KeyCode.LeftArrow))
      yield Rotate(Quaternion.Euler(0, -90, 0));
    else if (Input.GetKeyDown(KeyCode.UpArrow) && Input.GetButton('Jump'))
      yield Move(this.transform.forward + Vector3(0, 1, 0));
    else if (Input.GetKeyDown(KeyCode.UpArrow))
      yield Move(this.transform.forward);
    else if (Input.GetKeyDown(KeyCode.DownArrow))
      yield Move(this.transform.forward * -1);
    else 
      yield;

  }

  // Apply gravity
  moveDirection.y -= gravity * Time.deltaTime;
  
  // Move the controller
  controller.Move(moveDirection * Time.deltaTime);

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

function Update () {

  
}