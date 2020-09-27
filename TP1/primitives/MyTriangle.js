/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.p1 = [x1, y1, z1];
		this.p2 = [x2, y2, z2];
		this.p3 = [x3, y3, z3];

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2],
			this.p2[0], this.p2[1], this.p2[2],
			this.p3[0], this.p3[1], this.p3[2]
        ];
        
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
        
		//TexCoords
		var a = Math.sqrt(Math.pow((this.p2[0] - this.p1[0]),2) +
			              Math.pow((this.p2[1] - this.p1[1]),2) +
			              Math.pow((this.p2[2] - this.p1[2]),2));
		var b = Math.sqrt(Math.pow((this.p3[0] - this.p2[0]),2) +
                          Math.pow((this.p3[1] - this.p2[1]),2) +
                          Math.pow((this.p3[2] - this.p2[2]),2));
		var c = Math.sqrt(Math.pow((this.p3[0] - this.p1[0]),2) +
                          Math.pow((this.p3[1] - this.p1[1]),2) +
                          Math.pow((this.p3[2] - this.p1[2]),2));

		var alpha = Math.acos((Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) / (2 * a * c));

		this.texCoords = [
			0, 0,
			a, 0,   //(c*cos(a)+a-c*cos(a))=a
		    c * (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) / (2 * a * c), c * Math.sin(alpha) //c*cos(a), c*sin(a)
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	mapTextures(lenght_s, lenght_t) {

		var a = vec3.dist(this.p1, this.p2);
		var b = vec3.dist(this.p2, this.p3);
		var c = vec3.dist(this.p1, this.p3);

		var ang = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c));

		this.texCoords = [
            0, 0,
			a/lenght_s, 0,
			(c*Math.cos(ang))/lenght_s, (c*Math.sin(ang))/lenght_t
		];

		this.tCoords = this.texCoords.slice();
		this.updateTexCoordsGLBuffers();
	}

};

