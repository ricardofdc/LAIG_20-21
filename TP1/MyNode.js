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
        this.material = null;
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
     * Clears the texture of a node
     */
    clearTexture(){
        this.texture = null;
    }

    /**
     * Defines new material of a node
     * @param {string} material
     */
    setMaterial(material){
        this.material = material;
    }
}
