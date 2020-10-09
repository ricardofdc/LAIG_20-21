const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block.
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.default_view = this.reader.getString(viewsNode, 'default');
        this.views = [];

        var children = viewsNode.children;

        if (this.default_view == null) {
            this.onXMLError("Default view must be defined!");
        }

        if (children.length == 0){
            this.onXMLError("No view defined!");
        }

        for (var i=0; i<children.length; i++) {
            var grandChildren = children[i].children;

            var view_id = this.reader.getString(children[i], 'id');
            var cameraType = children[i].nodeName;

            var near = this.reader.getFloat(children[i], 'near');
            var far = this.reader.getFloat(children[i], 'far');

            if(near == null || far == null) {
                this.onXMLError("Invalid near/far value!");
                continue;
            }

            var nodeNames = [];
            for (let j=0; j<grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var indexFrom = nodeNames.indexOf("from");
            var from = this.parseCoordinates3D(grandChildren[indexFrom]);

            var indexTo = nodeNames.indexOf("to");
            var to = this.parseCoordinates3D(grandChildren[indexTo]);

            if (cameraType == "ortho") {
                var left = this.reader.getFloat(children[i], 'left');
                var right = this.reader.getFloat(children[i], 'right');
                var top = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                if(left==null || right==null || top==null || bottom == null){
                    this.onXMLError("Invalid left / right / top / bottom value!");
                    continue;
                }

                var indexUp = nodeNames.indexOf("up");
                var up;
                if(indexUp== -1){
                    up = [0,1,0];
                }
                else up = this.parseCoordinates3D(grandChildren[indexUp]);

                this.views[view_id] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
            }
            else if(cameraType == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
                angle *= DEGREE_TO_RAD;
                this.views[view_id] = new CGFcamera(angle, near, far, from, to);
            }
            else{
                this.onXMLError("Invalid camera type!");
            }
        }

        this.log("Parsed views.");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        this.textures = [];

        var textures = texturesNode.children;

        for(let i=0; i<textures.length; i++){
            let nodeName = textures[i].nodeName;
            if(nodeName != "texture"){
                this.onXMLMinorError("Unknown tag name <" + nodeName + "> inside textures.");
                continue;
            }

            //get texture id
            let textureID = this.reader.getString(textures[i], 'id');
            if(textureID == null){
                this.onXMLMinorError("Failed to parse texture ID");
                continue;
            }
            if(this.textures[textureID] != null){
                this.onXMLMinorError("Texture ID must be unique. (ID=" + textureID + " is duplicated).");
                continue;
            }

            //get texture path
            var texturePath = this.reader.getString(textures[i], 'path');
            if(texturePath == null){
                this.onXMLMinorError("Unable to parse texture path of texture with ID=" + textureID);
                continue;
            }

            if(!texturePath.includes("./scenes/images/")){
                texturePath = "./scenes/images/" + texturePath;
            }
            else if(!texturePath.includes("./scenes/")){
                texturePath = "./scenes/" + texturePath;
            }

            this.textures[textureID] = new CGFtexture(this.scene, texturePath);
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            this.materials[materialID]= new CGFappearance(this.scene);

            if(i==0){
                this.defaultMaterialID = materialID;
            }

            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {

                nodeNames.push(grandChildren[j].nodeName);

                if(grandChildren[j].nodeName == 'shininess'){
                    var shininess = this.reader.getFloat(grandChildren[j],'value');
                    this.materials[materialID].setShininess(shininess);
                }
                else{
                    var color = this.parseColor(grandChildren[j],grandChildren[j].nodeName);

                    switch (grandChildren[j].nodeName) {
                        case 'ambient':
                            this.materials[materialID].setAmbient(color[0],color[1],color[2],color[3]);
                            break;
                        case 'diffuse':
                            this.materials[materialID].setDiffuse(color[0],color[1],color[2],color[3]);
                            break;
                        case 'specular':
                            this.materials[materialID].setSpecular(color[0],color[1],color[2],color[3]);
                            break;
                        case 'emissive':
                            this.materials[materialID].setEmission(color[0],color[1],color[2],color[3]);
                            break;
                    }
                }
            }
        }

        this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");


            //add node to nodes array
            this.nodes[nodeID] = new MyNode(nodeID);

            // TRANSFORMATIONS
            if(transformationsIndex == -1){
                return this.onXMLError("No <transformations> tag in " + nodeID);
            }

            var transformationMatrix = mat4.create();
            var transformations = grandChildren[transformationsIndex].children;

            for(var j=0; j<transformations.length;j++){
                switch(transformations[j].nodeName){
                    case 'translation':
                        var coordinates = this.parseCoordinates3D(transformations[j], "translate transformation for node " + nodeID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transformationMatrix = mat4.translate(transformationMatrix, transformationMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseScaleCoordinates(transformations[j], "scale transformation for node " + nodeID);
                        if(!Array.isArray(coordinates))
                            return coordinates;
                        transformationMatrix = mat4.scale(transformationMatrix, transformationMatrix, coordinates);
                        break;
                    case 'rotation':
                        var axis = this.reader.getString(transformations[j], 'axis');
                        var angle = this.reader.getFloat(transformations[j], 'angle');

                        if (angle == null || isNaN(angle)) {
                            this.onXMLMinorError("Rotation angle must be a number.");
                            continue;
                        }
                        if (axis == "x") {
                            mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, [1, 0, 0]);
                        }
                        else if (axis == "y") {
                            mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, [0, 1, 0]);
                        }
                        else if (axis == "z") {
                            mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, [0, 0, 1]);
                        }
                        else {
                            this.onXMLMinorError("Invalid rotation axis in node \"" + nodeID + "\"");
                            continue;
                        }
                        break;
                }
                this.nodes[nodeID].transformations = transformationMatrix;
            }

            // MATERIAL
            if(materialIndex == -1){
                return this.onXMLError("No <material> tag in " + nodeID);
            }

            var material = grandChildren[materialIndex];
            var material_id = this.reader.getString(material, 'id');

            if(this.materials[material_id] == null && material_id != "null"){
                this.onXMLMinorError("Material of node \"" + nodeID + "\" with id=\"" + material_id + "\" not defined in <materials>. Assuming material=\"" + this.defaultMaterialID + "\"");
                material_id = this.defaultMaterialID;
            }
            this.nodes[nodeID].setMaterial(material_id);

            // TEXTURE
            var textureNode = grandChildren[textureIndex];
            if(textureIndex == -1){
                return this.onXMLError("No <texture> tag in " + nodeID);
            }

            //reads texture id
            var textureID = this.reader.getString(textureNode, 'id');
            if(textureID == null){
                this.onXMLMinorError("Texture of node " + nodeID + " doesn't have 'id' defined. Assuming id=\"null\".");
                textureID = "null";
            }

            //looks for texture id if it is dfferent from null or clear
            if(this.textures[textureID] == null && textureID != "null" && textureID != "clear"){
                this.onXMLMinorError("Texture of node \"" + nodeID + "\" with id=\"" + textureID + "\" is not defined in <textures>. Assuming id=\"null\".");
            }
            this.nodes[nodeID].setTexture(textureID);

            //reads amplification
            var textureChildren = textureNode.children;
            for(let j=0; j<textureChildren.length; j++){
                var nodeName = textureChildren[j].nodeName;
                if(nodeName == "amplification"){
                    var texture_afs = this.reader.getFloat(textureChildren[0], 'afs');
                    var texture_aft = this.reader.getFloat(textureChildren[0], 'aft');
                    if (texture_afs == null || isNaN(texture_afs)){
                        this.onXMLMinorError("Unable to parse afs in texture of node " + nodeID + ". Assuming afs=1.");
                        texture_afs = 1;
                    }
                    if (texture_aft == null || isNaN(texture_aft)){
                        this.onXMLMinorError("Unable to parse aft in texture of node " + nodeID + ". Assuming aft=1.");
                        texture_aft = 1;
                    }
                    this.nodes[nodeID].setTextureAfs(texture_afs);
                    this.nodes[nodeID].setTextureAft(texture_aft);
                }
                else{
                    this.onXMLMinorError("Tag <" + nodeName + "> is not recognized in " + nodeID);
                }
            }

            // DESCENDANTS
            if(descendantsIndex == -1){
                return this.onXMLError("No <descendants> tag in " + nodeID);
            }

            //All descendants of current node
            var descendants = grandChildren[descendantsIndex].children;

            if(descendants.length == 0){
                return this.onXMLError("Node " + nodeID + ": must have at least one descendant.");
            }

            //Check for all the descendants inside descendants tag
            for(let j=0; j<descendants.length; j++){

                //parse leaf nodes
                if(descendants[j].nodeName == "leaf"){
                    var leaf_type = this.reader.getString(descendants[j], 'type');
                    switch (leaf_type) {
                        case "rectangle":
                            // x1
                            var x1 = this.reader.getFloat(descendants[j], 'x1');
                            if (x1 == null || isNaN(x1))
                                return this.onXMLMinorError("Unable to parse x1 of the " + leaf_type + " coordinates on node " + nodeID);
                            // x2
                            var x2 = this.reader.getFloat(descendants[j], 'x2');
                            if (x2 == null || isNaN(x2))
                                return this.onXMLMinorError("Unable to parse x2 of the " + leaf_type + " coordinates on node " + nodeID);
                            // y1
                            var y1 = this.reader.getFloat(descendants[j], 'y1');
                            if (y1 == null || isNaN(y1))
                                return this.onXMLMinorError("Unable to parse y1 of the " + leaf_type + " coordinates on node " + nodeID);
                            // y2
                            var y2 = this.reader.getFloat(descendants[j], 'y2');
                            if (y2 == null || isNaN(y2))
                                return this.onXMLMinorError("Unable to parse y2 of the " + leaf_type + " coordinates on node " + nodeID);

                            this.nodes[nodeID].addLeaf(new MyRectangle(this.scene, x1, y1, x2, y2));
                            break;

                        case "triangle":
                            // x1
                            var x1 = this.reader.getFloat(descendants[j], 'x1');
                            if (x1 == null || isNaN(x1))
                                return this.onXMLMinorError("Unable to parse x1 of the " + leaf_type + " coordinates on node " + nodeID);
                            // y1
                            var y1 = this.reader.getFloat(descendants[j], 'y1');
                            if (y1 == null || isNaN(y1))
                                return this.onXMLMinorError("Unable to parse y1 of the " + leaf_type + " coordinates on node " + nodeID);
                            // x2
                            var x2 = this.reader.getFloat(descendants[j], 'x2');
                            if (x2 == null || isNaN(x2))
                                return this.onXMLMinorError("Unable to parse x2 of the " + leaf_type + " coordinates on node " + nodeID);
                            // y2
                            var y2 = this.reader.getFloat(descendants[j], 'y2');
                            if (y2 == null || isNaN(y2))
                                return this.onXMLMinorError("Unable to parse y2 of the " + leaf_type + " coordinates on node " + nodeID);
                            // x3
                            var x3 = this.reader.getFloat(descendants[j], 'x3');
                            if (x3 == null || isNaN(x3))
                                return this.onXMLMinorError("Unable to parse x3 of the " + leaf_type + " coordinates on node " + nodeID);
                            // y3
                            var y3 = this.reader.getFloat(descendants[j], 'y3');
                            if (y3 == null || isNaN(y3))
                                return this.onXMLMinorError("Unable to parse y3 of the " + leaf_type + " coordinates on node " + nodeID);
                            this.nodes[nodeID].addLeaf(new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3));
                            break;

                        case "sphere":
                            // radius
                            var radius = this.reader.getFloat(descendants[j], 'radius');
                            if (radius == null || isNaN(radius))
                                return this.onXMLMinorError("Unable to parse radius of the " + leaf_type + " on node " + nodeID);

                            // slices
                            var slices = this.reader.getInteger(descendants[j], 'slices');
                            var slices_float = this.reader.getFloat(descendants[j], 'slices');
                            if(slices != slices_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration slices=" + slices_float + " was rounded to slices=" + slices + " on node " + nodeID);
                            }
                            if (slices == null || isNaN(slices))
                                return this.onXMLMinorError("Unable to parse slices of the " + leaf_type + " on node " + nodeID);

                            // stacks
                            var stacks = this.reader.getInteger(descendants[j], 'stacks');
                            var stacks_float = this.reader.getFloat(descendants[j], 'stacks');
                            if(stacks != stacks_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration stacks=" + stacks_float + " was rounded to stacks=" + stacks + " on node " + nodeID);
                            }
                            if (stacks == null || isNaN(stacks))
                                return this.onXMLMinorError("Unable to parse stacks of the " + leaf_type + " on node " + nodeID);
                            this.nodes[nodeID].addLeaf(new MySphere(this.scene, radius, slices, stacks));
                            break;

                        case "cylinder":
                            // height
                            var height = this.reader.getFloat(descendants[j], 'height');
                            if (height == null || isNaN(height))
                                return this.onXMLMinorError("Unable to parse height of the " + leaf_type + " on node " + nodeID);

                            // topRadius
                            var topRadius = this.reader.getFloat(descendants[j], 'topRadius');
                            if (topRadius == null || isNaN(topRadius))
                                return this.onXMLMinorError("Unable to parse topRadius of the " + leaf_type + " on node " + nodeID);

                            // bottomRadius
                            var bottomRadius = this.reader.getFloat(descendants[j], 'bottomRadius');
                            if (bottomRadius == null || isNaN(bottomRadius))
                                return this.onXMLMinorError("Unable to parse bottomRadius of the " + leaf_type + " on node " + nodeID);

                            // slices
                            var slices = this.reader.getInteger(descendants[j], 'slices');
                            var slices_float = this.reader.getFloat(descendants[j], 'slices');
                            if(slices != slices_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration slices=" + slices_float + " was rounded to slices=" + slices + " on node " + nodeID);
                            }
                            if (slices == null || isNaN(slices))
                                return this.onXMLMinorError("Unable to parse slices of the " + leaf_type + " on node " + nodeID);

                            // stacks
                            var stacks = this.reader.getInteger(descendants[j], 'stacks');
                            var stacks_float = this.reader.getFloat(descendants[j], 'stacks');
                            if(stacks != stacks_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration stacks=" + stacks_float + " was rounded to stacks=" + stacks + " on node " + nodeID);
                            }
                            if (stacks == null || isNaN(stacks))
                                return this.onXMLMinorError("Unable to parse stacks of the " + leaf_type + " on node " + nodeID);
                            this.nodes[nodeID].addLeaf(new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks));
                            break;

                        case "torus":
                            // inner
                            var inner = this.reader.getFloat(descendants[j], 'inner');
                            if (inner == null || isNaN(inner))
                                return this.onXMLMinorError("Unable to parse inner of the " + leaf_type + " on node " + nodeID);

                            // outer
                            var outer = this.reader.getFloat(descendants[j], 'outer');
                            if (outer == null || isNaN(outer))
                                return this.onXMLMinorError("Unable to parse outer of the " + leaf_type + " on node " + nodeID);

                            // slices
                            var slices = this.reader.getInteger(descendants[j], 'slices');
                            var slices_float = this.reader.getFloat(descendants[j], 'slices');
                            if(slices != slices_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration slices=" + slices_float + " was rounded to slices=" + slices + " on node " + nodeID);
                            }
                            if (slices == null || isNaN(slices))
                                return this.onXMLMinorError("Unable to parse slices of the " + leaf_type + " on node " + nodeID);

                            // loops
                            var loops = this.reader.getInteger(descendants[j], 'loops');
                            var loops_float = this.reader.getFloat(descendants[j], 'loops');
                            if(loops != loops_float){
                                this.onXMLMinorError("On " + leaf_type + " declaration loops=" + loops_float + " was rounded to loops=" + loops + " on node " + nodeID);
                            }
                            if (loops == null || isNaN(loops))
                                return this.onXMLMinorError("Unable to parse loops of the " + leaf_type + " on node " + nodeID);
                            this.nodes[nodeID].addLeaf(new MyTorus(this.scene, inner, outer, slices, loops));
                            break;

                        default:
                            this.onXMLMinorError("unknown leaf type " + leaf_type + " on node " + nodeID);
                            break;
                    }
                }
                //parse intermidiate nodes
                else if(descendants[j].nodeName == "noderef"){
                    this.nodes[nodeID].addNode(this.reader.getString(descendants[j], 'id'));
                }
                else{
                    this.onXMLMinorError("unknown tag <" + descendants[j].nodeName + "> on node " + nodeID);
                }
            }
        }
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))){
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }

        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a scale transformation
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseScaleCoordinates(node, messageError) {
        var position = [];

        // sx
        var x = this.reader.getFloat(node, 'sx');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // sy
        var y = this.reader.getFloat(node, 'sy');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // sz
        var z = this.reader.getFloat(node, 'sz');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Change camera to the selected on interface
     */
    changeView(){
        this.scene.camera = this.views[this.default_view];
        this.scene.interface.setActiveCamera(this.scene.camera);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        if (this.nodes[this.idRoot] == null){
            this.onXMLError(this.idRoot + " not found!");
            this.scene.sceneInited = false;
            return;
        }
        let rootMaterial = this.nodes[this.idRoot].material;
        if(rootMaterial == "null"){
            rootMaterial = this.defaultMaterialID;
        }
        let rootTexture = this.nodes[this.idRoot].texture;
        this.processNode(this.idRoot, rootMaterial, rootTexture, 1, 1);

        //To do: Create display loop for transversing the scene graph, calling the root node's display function
    }

    /**
     * Recursive process of each node.
     * @param {string} id - id of the node to process
     */
    processNode(id, mat, text, afs, aft){
        /**
        *
        * ProcessNode(id, tg, mat, text, afs, aft){
        *   ajustar tg->tg1(matriz transformação Ma*Mn);
        *   ajustar mat->mat1 (material);
        *   ajustar text->text1 (textura);
        *   para cada descendente:
        *       if(descendente == primitiva):
        *           desenhar descendente;
        *       else:
        *           push(t1);
        *           push(mat1);
        *           push(text1);
        *           ProcessNode(child, tg1, mat1, text1, afs, aft);
        * }
        *
        */

        var node = this.nodes[id];
        var node_material;
        var mat_id = mat;
        var texture = text;

        this.scene.pushMatrix();


        //Materials

        //maintains material from parent node
        if(node.material != "null" && node.material != null){
            mat_id = node.material;
        }

        node_material = this.materials[mat_id];

        //Texturas
        if(node.texture == "clear"){
            node.clearTexture();
        }
        else if(node.texture != "null"){
            texture = node.texture;
        }

        if(texture == null){
            node_material.setTexture(null);
        }
        else{
            node_material.setTexture(this.textures[texture]);
        }
        node_material.setTextureWrap('REPEAT', 'REPEAT');
        node_material.apply();

        //afs and aft
        if(node.texture_afs != null){
            afs = node.texture_afs;
        }
        if(node.texture_aft != null){
            aft = node.texture_aft;
        }


        //ajustar matriz de transformação
        if(node.transformations!=null){
            this.scene.multMatrix(node.transformations);
        }

        //correr os descendentes
        for(let i=0; i<node.descendants.leaves.length; i++){
            node.descendants.leaves[i].updateTexCoords(afs, aft);
            node.descendants.leaves[i].display();
        }
        for(let i=0; i<node.descendants.nodes.length; i++){

            var child_id = node.descendants.nodes[i];
            if (this.nodes[child_id] == null){
                this.onXMLError(child_id + " node used in " + id + " not found!");
                this.scene.sceneInited = false;
                return;
            }
            this.processNode(child_id, mat_id, texture, afs, aft);
        }
        this.scene.popMatrix();
    }
}
