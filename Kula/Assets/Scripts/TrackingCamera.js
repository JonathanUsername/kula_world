#pragma strict

function Start () {

}

function Update () {
  var h = 2;
  var player = GameObject.Find('Bomb');
  // print(player.transform.position);
  var cameraHeight = new Vector3(0, 1, 0);
  var cameraBackwardsOffset = player.transform.forward * 5;
  this.transform.position = player.transform.position + cameraHeight - cameraBackwardsOffset;
  this.transform.LookAt(player.transform);
}