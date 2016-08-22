#pragma strict

function Start () {

}

function Update () {
  var h = 2;
  var player = GameObject.Find('Ball');
  this.transform.position = player.transform.position - player.transform.forward * 5;
  this.transform.LookAt(player.transform);
}