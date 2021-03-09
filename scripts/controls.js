MyGame.screens['controls'] = (function(game) {
    'use strict';

    function initialize() {

        document.getElementById('controls-back-button').addEventListener(
            'click',
            function() {game.showScreen('main-menu');});
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.main));