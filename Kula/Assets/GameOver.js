#pragma strict

import UnityEngine.SceneManagement;

public var restartDelay : float = 4;
private var restartTimer : float = 0;
private var started = false;

function Start () {
  this.gameObject.SetActive(false);
}

function Update () {
  if (started) {
    restartTimer += Time.deltaTime * 1;
  }

  if (restartTimer >= restartDelay) {
    var s = SceneManager.GetActiveScene().buildIndex;
    SceneManager.LoadScene(s);
  }
}

function TriggerGameOver () {
  started = true;
  this.gameObject.SetActive(true);
}