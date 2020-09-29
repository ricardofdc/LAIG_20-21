/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - radius of the sphere
 * @param slices - number of meridians
 * @param stacks - half the number of paralels
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.semiSpherePositive = new MySemiSphere(this.scene, radius, slices, stacks);
        this.semiSphereNegative = new MySemiSphere(this.scene, radius, slices, stacks);

        this.initBuffers();
    }

    display() {
      this.scene.pushMatrix();
      this.semiSpherePositive.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.rotate(Math.PI, 1, 0, 0);
      this.semiSphereNegative.display();
      this.scene.popMatrix();
    }

    updateTexCoords(coords) {
  		this.texCoords = [...coords];
  		this.updateTexCoordsGLBuffers();
  	}

}
