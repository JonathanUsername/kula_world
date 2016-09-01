#pragma strict

import UnityEngine.UI;

public var fuseTimeSecs : int;
public var frequency : int;

// private var nextActionTime : float;
private var fuseMovementStep : float;
private var fullyMovedIn : Vector3;
private var fuse : GameObject;
private var bomb : GameObject;
private var timer : GameObject;
private var txt : Text;
private var GameOver;
private var deepRed : Color = Vector4(0.7,0,0,1);

function Start () {
  print(fuseTimeSecs);
  bomb = bomb.Find('Bomb');
  fuse = bomb.Find('Fuse');
  timer = this.gameObject.Find('TimerText');
  fullyMovedIn = fuse.transform.position + fuse.transform.up * -0.3;
  fuseMovementStep = parseFloat(frequency) / parseFloat(fuseTimeSecs); // OMG WHAT, can't get a float from dividing two ints without parsefloat?!?!?
  InvokeRepeating('MoveFuseIn', frequency, frequency);
}

function Update () {
  txt = timer.GetComponent.<Text>();

  if (fuseTimeSecs < 10)
    txt.color = deepRed;

  if (fuseTimeSecs >= 0)
    txt.text = fuseTimeSecs.ToString();
}

function MoveFuseIn() {
  var pt = fuse.transform.position;

  if (fuseTimeSecs < 0) {
    Explode();
    CancelInvoke();
  }

  fuseTimeSecs -= 1;
  fuse.transform.position = pt - fuse.transform.up * 0.3 * fuseMovementStep;

}

function Explode() {

  // Create fireball
  var fireball = GameObject.CreatePrimitive(PrimitiveType.Sphere);
  var menu = GameObject.Find('MenuController');
  var GameOver = menu.transform.GetChild(0).GetComponent.<GameOver>();
  Destroy(fireball.GetComponent.<SphereCollider>());
  fireball.GetComponent.<Renderer>().material.color = Color.red; // Use fire material eventually
  fireball.transform.position = bomb.transform.position;

  // Explode fireball
  var sc = fireball.transform.localScale;
  var eventualSize = Vector3(5, 5, 5);
  var goal = fireball.transform.localScale + eventualSize;
  var t : float = 0;
  var duration = 0.2;

  bomb.SetActive(false);

  while (t < duration) {
    fireball.transform.localScale = Vector3.Lerp(sc, goal, t / duration);
    t += Time.deltaTime;
    yield;
  }

  fireball.SetActive(false);
  GameOver.TriggerGameOver();

}