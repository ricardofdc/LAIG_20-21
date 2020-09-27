/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - bottom base radius
 * @param topRadius - top base radius
 * @param height - cilinder height
 * @param slices - number of divisions in rotation
 * @param stacks - number of divisions in height
 */
class MyCylinder extends CGFobject {
	constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
		super(scene);
		this.bottomRadius = bottomRadius;
		this.topRadius = topRadius;
		this.height = height;
		this.slices = slices;
    this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radius = this.bottomRadius;
    const delta_radius = (this.topRadius - this.bottomRadius) / this.stacks;
    const delta_angle = 2 * Math.PI / this.slices;
    var z = 0;
    const delta_z = this.height / this.stacks;
    const diff_radius = this.bottomRadius - this.topRadius;

    //body of the cylinder
    for(var i=0; i<=this.stacks; i++){
      for(var j=0; j<this.slices; j++){
        this.vertices.push(
          radius * Math.cos(j * delta_angle),
          radius * Math.sin(j * delta_angle),
          z
        );

        //cálculo e normalização das normais
        var normal = [
          radius * Math.cos(j * delta_angle),
          radius * Math.sin(j * delta_angle),
          ( diff_radius * radius ) / this.height  // height/diff_radius = radius/z_normal
        ]
        var normal_size = Math.sqrt(normal[0]*normal[0]+normal[1]*normal[1]+normal[2]*normal[2]);
        normal[0] /= normal_size;
        normal[1] /= normal_size;
        normal[2] /= normal_size;
        this.normals.push(...normal);

        this.texCoords.push(j / this.slices, i / this.stacks);


      }

      z += delta_z;
      radius += delta_radius;
    }


    for(var i=0; i<this.stacks; i++){
      for(var j=0; j<this.slices; j++){
        if(j == this.slices - 1){   //neste caso ao fazer 'j+1' iriamos para o stack seguinte
          this.indices.push(        //por isso retiramos 1 ao i sempre que temos 'j+1'
            i * this.slices + j,
            (i - 1) * this.slices + j + 1,
            i * this.slices + j + 1
          );
          this.indices.push(
            i * this.slices + j + 1,
            (i + 1) * this.slices + j,
            i * this.slices + j
          );
        }
        else{   //caso geral
          this.indices.push(
            i * this.slices + j,
            i * this.slices + j + 1,
            (i + 1) * this.slices + j + 1
          );
          this.indices.push(
            (i + 1) * this.slices + j + 1,
            (i + 1) * this.slices + j,
            i * this.slices + j
          );
        }
      }
    }
    console.log(this.vertices);

    //bottom base of the Cylinder
    ////until this point we have 'this.slices * (this.stacks+1)' vertices
    const origin_vertice_number = this.slices * (this.stacks+1);
    this.vertices.push(0,0,0);
    this.normals.push(0,0,-1);
    for(var i=0; i<this.slices; i++){
      this.vertices.push(
        this.bottomRadius * Math.cos(i * delta_angle),
        this.bottomRadius * Math.sin(i * delta_angle),
        0
      );
      this.normals.push(0,0,-1);
      this.texCoords.push(j / this.slices, 0);
    }
    for(var i=1; i<this.slices; i++){
      this.indices.push(
        origin_vertice_number, // (0,0,0)
        origin_vertice_number + i + 1,
        origin_vertice_number + i
      );
    }
    this.indices.push(
      origin_vertice_number, // (0,0,0)
      origin_vertice_number + 1,
      origin_vertice_number + this.slices
    );

    console.log(this.indices);

    //top base of the Cylinder
    ////until this point we have 'this.slices * (this.stacks+2) + 1' vertices
    const top_center_vertice_number = this.slices * (this.stacks+2) + 1;
    this.vertices.push(0,0,this.height);
    this.normals.push(0,0,1);
    for(var i=0; i<this.slices; i++){
      this.vertices.push(
        this.topRadius * Math.cos(i * delta_angle),
        this.topRadius * Math.sin(i * delta_angle),
        this.height
      );
      this.normals.push(0,0,1);
      this.texCoords.push(j / this.slices, 1);
    }
    for(var i=1; i<this.slices; i++){
      this.indices.push(
        top_center_vertice_number, // (0,0,height)
        top_center_vertice_number + i,
        top_center_vertice_number + i + 1
      );
    }
    this.indices.push(
      top_center_vertice_number, // (0,0,height)
      top_center_vertice_number + this.slices,
      top_center_vertice_number + 1
    );


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
