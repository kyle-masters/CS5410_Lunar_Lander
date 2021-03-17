MyGame.screens['controls'] = (function(game) {
    'use strict';

    function initialize() {

        document.getElementById('thrust-control-button').innerText += game.keyBindings.keys.thrust;
        document.getElementById('left-rotate-control-button').innerText += game.keyBindings.keys.lRotate;
        document.getElementById('right-rotate-control-button').innerText += game.keyBindings.keys.rRotate;

        document.getElementById('thrust-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keydown', setThrust);
            }
        )

        document.getElementById('left-rotate-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keydown', setLRotate);
            }
        )

        document.getElementById('right-rotate-control-button').addEventListener(
            'click',
            function() {
                window.addEventListener('keydown', setRRotate);
            }
        )

        document.getElementById('controls-back-button').addEventListener(
            'click',
            function() {game.showScreen('main-menu');});
    }

    function setThrust(e) {
        game.keyBindings.keys.thrust = e.key;
        document.getElementById('thrust-control-button').innerText = "Thrust - " + e.key;
        window.removeEventListener('keydown', setThrust);
    }

    function setLRotate(e) {
        game.keyBindings.keys.lRotate = e.key;
        document.getElementById('left-rotate-control-button').innerText = "Rotate Left - " + e.key;
        window.removeEventListener('keydown', setLRotate);
    }

    function setRRotate(e) {
        game.keyBindings.keys.rRotate = e.key;
        document.getElementById('right-rotate-control-button').innerText = "Rotate Right - " + e.key;
        window.removeEventListener('keydown', setRRotate);
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.main));