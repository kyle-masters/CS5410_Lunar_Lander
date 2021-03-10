MyGame.screens['controls'] = (function(game) {
    'use strict';

    function initialize() {

        document.getElementById('thrust-control-button').innerText += game.keyBindings.keys.thrust;
        document.getElementById('left-rotate-control-button').innerText += game.keyBindings.keys.lRotate;
        document.getElementById('right-rotate-control-button').innerText += game.keyBindings.keys.rRotate;

        document.getElementById('thrust-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keypress', setThrust);
            }
        )

        document.getElementById('left-rotate-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keypress', setLRotate);
            }
        )

        document.getElementById('right-rotate-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keypress', setRRotate);
            }
        )

        document.getElementById('controls-back-button').addEventListener(
            'click',
            function() {game.showScreen('main-menu');});
    }

    function setThrust(e) {
        game.keyBindings.keys.thrust = e.key;
        document.getElementById('thrust-control-button').innerText = "Thrust - " + e.key;
        window.removeEventListener('keypress', setThrust);
    }

    function setLRotate(e) {
        game.keyBindings.keys.lRotate = e.key;
        document.getElementById('left-rotate-control-button').innerText = "Rotate Left - " + e.key;
        window.removeEventListener('keypress', setLRotate);
    }

    function setRRotate(e) {
        game.keyBindings.keys.rRotate = e.key;
        document.getElementById('right-rotate-control-button').innerText = "Rotate Right - " + e.key;
        window.removeEventListener('keypress', setRRotate);
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.main));