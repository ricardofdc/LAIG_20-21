/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner radius of the torus
 * @param outer - outer radius of the torus
 * @param slices - number of meridians
 * @param stacks - number of paralels
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, stacks) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords=[];

        // TODO

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
  		this.texCoords = [...coords];
  		this.updateTexCoordsGLBuffers();
  	}

}
