/**
 * MySemiSphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - radius of the sphere
 * @param slices - number of meridians
 * @param stacks - number of paralels
 */
class MySemiSphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords=[];

        var nr_vertices=0;
        var theta = 2*Math.PI / this.slices;  //variação do angulo entre slices
        var phi = (Math.PI/2) / this.stacks;  //variação do angulo entre stacks

        //semi-esfera positiva
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {

                //vertices
                var x = Math.cos(j*theta) * Math.cos(i*phi) * this.radius;
                var y = Math.sin(j*theta) * Math.cos(i*phi) * this.radius;
                var z = Math.sin(i*phi) * this.radius;

                this.vertices.push(x,y,z);
                nr_vertices++;

                //normals
                var nx=x/this.radius;
                var ny=y/this.radius;
                var nz=z/this.radius;

                this.normals.push(nx, ny, nz);
                this.texCoords.push(i / this.slices, j / this.stacks);
            }
        }

        //polo norte
        this.vertices.push(0,0,this.radius);
        this.normals.push(0,0,1);
        this.texCoords.push(1,1);
        nr_vertices++;

        //indices
        for(var i=0; i<this.stacks; i++){
          for(var j=0; j<this.slices; j++){
            if (i == this.stacks-1) {  //neste caso temos de unir ao polo norte
              if(j == this.slices - 1){
                this.indices.push(i*this.slices + j, (i-1)*this.slices + j+1, nr_vertices-1);
              }
              else{
                this.indices.push(i*this.slices + j, i*this.slices + j+1, nr_vertices-1);
              }
            }
            else if(j == this.slices - 1){   //neste caso ao fazer 'j+1' iriamos para o stack seguinte
                                        //por isso retiramos 1 ao i sempre que temos 'j+1'
              this.indices.push(i*this.slices + j, (i-1)*this.slices + j+1, i*this.slices + j+1);
              this.indices.push(i*this.slices + j, i*this.slices + j+1, (i+1)*this.slices + j);
            }
            else{
              this.indices.push(i*this.slices + j, i*this.slices + j+1, (i+1)*this.slices + j+1);
              this.indices.push(i*this.slices + j, (i+1)*this.slices + j+1, (i+1)*this.slices + j);
            }
          }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
  		this.texCoords = [...coords];
  		this.updateTexCoordsGLBuffers();
  	}

}
