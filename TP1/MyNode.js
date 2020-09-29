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

    addLeaf(leaf){
      this.descendants.leaves.push(leaf);
    }
}
