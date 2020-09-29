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
        this.transformations = [];
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
}
