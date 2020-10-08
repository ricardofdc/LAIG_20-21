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




		for(let i=0; i<=this.slices; i++){
			this.vertices.push(0,0,0);
			this.normals.push(0,0,-1);
		}

		for(let i=0; i<=this.slices; i++){
			this.vertices.push(radius * Math.cos(-i * delta_angle), radius * Math.sin(-i * delta_angle), 0);
			this.normals.push(0,0,-1);
		}

		for(let i=0; i<=this.stacks; i++){
			for(let j=0; j<=this.slices; j++){
				this.vertices.push(radius * Math.cos(j * delta_angle), radius * Math.sin(j * delta_angle), z);
				var normal = [radius * Math.cos(j * delta_angle), radius * Math.sin(j * delta_angle), ( diff_radius * radius ) / this.height];
		        var normal_size = Math.sqrt(normal[0]*normal[0]+normal[1]*normal[1]+normal[2]*normal[2]);
		        normal[0] /= normal_size;
		        normal[1] /= normal_size;
		        normal[2] /= normal_size;
		        this.normals.push(...normal);
			}

			z += delta_z;
			radius += delta_radius;
		}

		for(let i=0; i<=this.slices; i++){
			this.vertices.push(0,0,this.height);
			this.normals.push(0,0,1);
		}

		radius -= delta_radius;
		for(let i=0; i<=this.slices; i++){
			this.vertices.push(radius * Math.cos(-i * delta_angle), radius * Math.sin(-i * delta_angle), this.height+0.01);
			this.normals.push(0,0,1);
		}

		var ind = 0;
		for (let i = 0; i < this.stacks + 4; i++) {
			for (let j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + 1, ind + this.slices + 1);
					this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				}
				ind++;
			}
		}
		this.updateTexCoords(1,1);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(afs, aft) {
		this.texCoords = [];

		var maxRadius = (this.topRadius > this.bottomRadius) ? this.topRadius : this.bottomRadius;

		//afs -> altura do cilindro
		//aft -> 2.pi.r = circunferencia


		const delta_angle = 2 * Math.PI / this.slices;
		//var radius = this.bottomRadius;
		var incS = afs / (this.height * this.stacks);
		var incT = aft / maxRadius / this.slices;


		for(let i=0; i<= this.slices; i++){
			let s=aft/maxRadius/2;
			let t=aft/maxRadius/2;
			this.texCoords.push(s,t);
		}
		for(let i=0; i<= this.slices; i++){
			let s=aft/maxRadius/2 * Math.cos(-i * delta_angle) + aft/maxRadius/2;
			let t=aft/maxRadius/2 * Math.sin(-i * delta_angle) + aft/maxRadius/2;
			this.texCoords.push(s,t);
		}

		for(let i=0; i<=this.stacks; i++){
			for(let j=0; j<=this.slices; j++){
				/*if(i==0){
					this.texCoords.push((aft/2*Math.PI) * Math.cos(j * delta_angle) + (aft/2*Math.PI) , (aft/2*Math.PI) * Math.sin(j * delta_angle) + (aft/2*Math.PI) );
				}
				else if(i==this.slacks){
					this.texCoords.push((aft/2*Math.PI) * Math.cos(j * delta_angle) + (aft/2*Math.PI), (aft/2*Math.PI) * Math.sin(j * delta_angle) + (aft/2*Math.PI));
				}
				else{*/
					this.texCoords.push(1 - incS * i, incT * j);
				//}
			}
		}

		for(let i=0; i<=this.slices; i++){
			let s=aft/maxRadius/2;
			let t=aft/maxRadius/2;
			this.texCoords.push(s,t);
		}

		for(let i=0; i<= this.slices; i++){
			let s=aft/maxRadius/2 * Math.cos(-i * delta_angle) + aft/maxRadius/2;
			let t=aft/maxRadius/2 * Math.sin(-i * delta_angle) + aft/maxRadius/2;
			this.texCoords.push(s,t);
		}

		this.updateTexCoordsGLBuffers();
	}
}
