/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner radius of the torus
 * @param outer - outer radius of the torus
 * @param slices - number of meridians
 * @param loops - number of loops
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords=[];

        var nr_vertices=0;
        var theta = 2*Math.PI / this.slices;  //variação do angulo entre slices
        var phi = 2*Math.PI / this.loops;  //variação do angulo entre stacks

        for (var i = 0; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) {

                //vertices
                var x = (this.outer + this.inner * Math.cos(j*theta)) * Math.cos(i*phi);
                var y = (this.outer + this.inner * Math.cos(j*theta)) * Math.sin(i*phi);
                var z = this.inner * Math.sin(j*theta);

                this.vertices.push(x,y,z);
                nr_vertices++;

                //normals
                var nx = Math.cos(j*theta) * Math.cos(i*phi);
                var ny = Math.cos(j*theta) * Math.sin(i*phi);
                var nz = Math.sin(j*theta);

                this.normals.push(nx, ny, nz);
                this.texCoords.push(1-(i / this.slices), 1-(j / this.loops));
            }
        }

        //indices
        for(var i=0; i<this.loops; i++){
          for(var j=0; j<this.slices; j++){
            if (i == this.loops-1) {  //neste caso temos de unir ao loop inicial
              if(j == this.slices - 1){
                this.indices.push(i*this.slices + j, 0, (i-1)*this.slices + j+1);
                this.indices.push(i*this.slices + j, j, 0);
              }
              else{
                this.indices.push(i*this.slices + j, j+1, i*this.slices + j+1);
                this.indices.push(i*this.slices + j, j, j+1);
              }
            }

            else if(j == this.slices -1){   //neste caso ao fazer 'j+1' iriamos para o loop seguinte
                                            //por isso retiramos 1 ao i sempre que temos 'j+1'
              this.indices.push(i*this.slices + j, i*this.slices + j+1, (i-1)*this.slices + j+1);
              this.indices.push(i*this.slices + j, (i+1)*this.slices + j, i*this.slices + j+1);
            }
            else{
              this.indices.push(i*this.slices + j, (i+1)*this.slices + j+1, i*this.slices + j+1);
              this.indices.push(i*this.slices + j, (i+1)*this.slices + j, (i+1)*this.slices + j+1);
            }
          }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(afs, aft) {
      this.updateTexCoordsGLBuffers();
    }

}
