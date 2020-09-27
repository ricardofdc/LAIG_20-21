/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.origTexCoords=[];

        var nr_vertices=0;
        var theta=Math.PI/this.stacks;
        var phi=2*Math.PI/this.slices;

        for (var i = 0; i <= this.slices; i++) {

            for (var j = 0; j <= this.stacks; j++) {
                
                //vertices
                var x = Math.sin(j*theta) * Math.cos(i*phi) * this.radius;
                var y = Math.sin(j*theta) * Math.sin(i*phi) * this.radius;
                var z = Math.cos(j*theta) * this.radius;

                this.vertices.push(x,y,z);
                nr_vertices++;

                //normals
                var nx=x/this.radius;
                var ny=y/this.radius;
                var nz=z/this.radius;

                this.normals.push(nx, ny, nz);

                //indices
                if (i>0 && j>0) {
                    this.indices.push(nr_vertices-this.stacks-1, nr_vertices-1, nr_vertices-this.stacks-2);
                    this.indices.push(nr_vertices-1, nr_vertices-2, nr_vertices-this.stacks-2);
                }

                //texCoords
                this.origTexCoords.push(0.5*(nx+1), 0.5*(1-ny));
                this.texCoords=this.origTexCoords.slice();
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
    mapTextures(lenght_s, lenght_t){

    }

};