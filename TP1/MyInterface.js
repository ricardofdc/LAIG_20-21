/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        // var primitives = this.gui.addFolder("Primitives (just for testing)");
        // primitives.open();
        // primitives.add(this.scene, 'displayRectangle').name("Display Rectangle");
        // primitives.add(this.scene, 'displayTriangle').name("Display Triangle");
        // primitives.add(this.scene, 'displayCylinder').name("Display Cylinder");
        // primitives.add(this.scene, 'displaySphere').name("Display Sphere");
        // primitives.add(this.scene, 'displayTorus').name("Display Torus");

        this.initKeys();

        return true;
    }

    initViews(graph){
        var folder = this.gui.addFolder("Views");
        folder.open();

        let viewsID = Object.keys(graph.views);
    
        this.gui.add(graph, 'default_view', viewsID).name("Camera").onChange(graph.changeView.bind(graph));
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
