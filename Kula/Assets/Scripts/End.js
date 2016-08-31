#pragma strict

public var Win : Win;

private var activated = false;

function Start () {

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