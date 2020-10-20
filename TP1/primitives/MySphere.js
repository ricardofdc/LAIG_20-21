/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Radius of the sphere
 * @param slices - Number of meridians
 * @param stacks - Number of paralels
 */
class MySphere extends CGFobject {

  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var theta = (2 * Math.PI) / this.slices;
    var phi = (Math.PI / 2) / this.stacks;

    for (var i = 0; i <= this.stacks * 2; i++) {
      for (var j = 0; j <= this.slices; j++) {

        //vertices
        var x = Math.sin(i * phi) * Math.cos(j * theta) * this.radius;
        var y = Math.sin(i * phi) * Math.sin(j * theta) * this.radius;
        var z = Math.cos(i * phi) * this.radius;
        this.vertices.push(x, y, z);

        //normals
        var nx = x / this.radius;
        var ny = y / this.radius;
        var nz = z / this.radius;
        this.normals.push(nx, ny, nz);

        //texCoords
        this.texCoords.push(j / this.slices, i / (this.stacks * 2));
      }
    }

    //indices
    for (var i = 0; i < this.stacks * 2; i++) {
      for (var j = 0; j < this.slices; j++) {
        this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1);
        this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1, i * (this.slices + 1) + j + 1);
      }

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

  }

  updateTexCoords(afs, aft) {
    this.updateTexCoordsGLBuffers();
  }

}