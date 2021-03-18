MyGame.main = (function (screens){
    'use strict';

    let keyBindings = {
        keys: {}
    }

    function showScreen(id) {

        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        screens[id].run();

        document.getElementById(id).classList.add('active');
    }

    function initialize() {
        keyBindings.keys.thrust = 'ArrowUp';
        keyBindings.keys.lRotate = 'ArrowLeft';
        keyBindings.keys.rRotate = 'ArrowRight';


        let screen = null;

        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    function setBinding(e, control) {

    }

    return {
        initialize : initialize,
        showScreen : showScreen,
        get keyBindings() { return keyBindings; }
    }

}(MyGame.screens));