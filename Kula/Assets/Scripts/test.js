#pragma strict

function Start () {

}

function Update () {
  var degs = 80;
  transform.RotateAround(this.transform.position, Quaternion.AngleAxis(20, this.transform.right) * this.transform.up, degs * Time.deltaTime);
}

function OnTriggerEnter (other : Collider) {
  if(other.gameObject.name == 'Ball') {
    print('trig! ball');
    var end : GameObject;
    // This will return the game object named Hand in the scene.
    end = GameObject.Find('End');
    end.GetComponent.<Renderer>().material.color = Color.green;
    // end.transform.position.y = 1;
    Destroy(this.gameObject);
  }
}