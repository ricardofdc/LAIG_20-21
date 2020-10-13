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

        // add a group of controls (and open/expand by defult

        this.initKeys();

        return true;
    }

    addLights(graph){
        var lights_folder = this.gui.addFolder("Lights");
        lights_folder.open();

        for(var key in graph.lights){
            lights_folder.add(graph.scene.lightValues, key);

        }
    }

    initViews(graph){
        var views_folder = this.gui.addFolder("Views");
        views_folder.open();

        let viewsID = Object.keys(graph.views);

        views_folder.add(graph, 'default_view', viewsID).name("Camera").onChange(graph.changeView.bind(graph));
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
