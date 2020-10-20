/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordenate of the 1st point of the triangle
 * @param y1 - y coordenate of the 1st point of the triangle
 * @param x2 - x coordenate of the 2nd point of the triangle
 * @param y2 - y coordenate of the 2nd point of the triangle
 * @param x3 - x coordenate of the 3rd point of the triangle
 * @param y3 - y coordenate of the 3rd point of the triangle
 */

class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.p1 = [x1, y1, 0];
		this.p2 = [x2, y2, 0];
		this.p3 = [x3, y3, 0];

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [...this.p1, ...this.p2, ...this.p3];

    //Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
    	];

		this.updateTexCoords(1,1);

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(afs, aft) {
		var a = Math.sqrt(Math.pow(this.p1[0] - this.p3[0], 2) + Math.pow(this.p1[1] - this.p3[1], 2));
		var b = Math.sqrt(Math.pow(this.p2[0] - this.p1[0], 2) + Math.pow(this.p2[1] - this.p1[1], 2));
		var c = Math.sqrt(Math.pow(this.p3[0] - this.p2[0], 2) + Math.pow(this.p3[1] - this.p2[1], 2));

		var alpha = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c));

		var v = a * Math.sin(alpha);

		this.texCoords = [
			0, 1,
			a/afs, 1,
			c*Math.cos(alpha)/afs, 1-c*Math.sin(alpha)/aft
		];

		this.updateTexCoordsGLBuffers();
	}

}
