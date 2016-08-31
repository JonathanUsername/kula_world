#pragma strict

public var Win : Win;

private var activated = false;

function Start () {
  var menu = GameObject.Find('MenuController');
  Win = menu.transform.GetChild(1).GetComponent.<Win>();
}

function Update () {

}

function Activate () {
  activated = true;
}

function OnTriggerEnter (other : Collider) {
  print('col');
  if(activated && other.gameObject.name == 'Bomb') {
    Win.TriggerWin();
  }
}