#pragma strict

function Start () {

}

function Update () {
  var degs = 80;
  transform.RotateAround(this.transform.position, Quaternion.AngleAxis(20, this.transform.right) * this.transform.up, degs * Time.deltaTime);
}

function OnTriggerEnter (other : Collider) {
  if(other.gameObject.name == 'Bomb') {
    var end : GameObject;
    end = GameObject.Find('End');
    end.GetComponent.<Renderer>().material.color = Color.green;
    end.GetComponent.<End>().Activate();

    Destroy(gameObject);
  }
}