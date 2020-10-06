/**
 * MyNode class, representing the scene graph.
 */
class MyNode {
    /**
     * Constructor for MyNode class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} id - Identifier of the node.
     */
    constructor(id){
        this.id = id;
        this.transformations = mat4.create();
        this.texture = null;
        this.texture_afs = null;
        this.texture_aft = null;
        this.material = [];
        this.descendants = {
            nodes:[],
            leaves:[]
        };
    }

    /*
     * Adds a leaf to the node's descendants
     * @param {primitive object} leaf
     */
    addLeaf(leaf){
        this.descendants.leaves.push(leaf);
    }

    /*
     * Adds a node to the node's descendants
     * @param {string} node_id
     */
    addNode(node_id){
        this.descendants.nodes.push(node_id);
    }

    /*
     * Sets the texture of a node
     * @param {string} texture_id
     */
    setTexture(texture_id){
        this.texture = texture_id;
    }

    /*
     * Sets the texture afs of a node
     * @param {float} texture_afs
     */
    setTextureAfs(texture_afs){
        this.texture_afs = texture_afs;
    }

    /*
     * Sets the texture aft of a node
     * @param {float} texture_afs
     */
    setTextureAfs(texture_aft){
        this.texture_aft = texture_aft;
    }

    /**
     * Defines new material of a node
     * @param {string} material 
     */
    createMaterial(material){
        this.material = material;
    }
}
