#pragma strict

function Start () {

}

function Update () {
  if (Input.GetKeyDown ('up')) {
    this.transform.position += this.transform.forward * 1;
  }
  if (Input.GetKeyDown ('down')) {
    this.transform.position -= this.transform.forward * 1;
  }
  if (Input.GetKeyDown ('left')) {
    this.transform.rotation *= Quaternion.Euler(0, 90, 0);
  }
  if (Input.GetKeyDown ('right')) {
    this.transform.rotation *= Quaternion.Euler(0, -90, 0);
  }
  
}