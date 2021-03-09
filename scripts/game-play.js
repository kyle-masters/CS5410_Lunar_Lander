MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();

    let myBackground = objects.Background({
        imageSrc: 'assets/background.jpg',
        center: {x: graphics.canvas.width/2, y: graphics.canvas.height/2},
        size: {width: graphics.canvas.width, height: graphics.canvas.height},
    });

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {

    }

    function render() {
        graphics.clear();
        renderer.Background.render(myBackground);

    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        myKeyboard.register('')
    }
})