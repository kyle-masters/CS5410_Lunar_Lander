MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let level;
    let landerRatio = 26.0/50.0;
    let landerHeight;

    let terrain = {
        strokeStyle: 'white',
        lineWidth: '2',
        fillStyle: 'DimGray'
    };

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();

    let myBackground = objects.Background({
        imageSrc: 'assets/background.jpg',
        center: {x: graphics.canvas.width/2, y: graphics.canvas.height/2},
        size: {width: graphics.canvas.width, height: graphics.canvas.height},
    });

    let myShip;

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        myShip.makeMovement(elapsedTime);
        let collisionEvent = myShip.detectCollision(terrain.lines);
        if(collisionEvent.collision) {
            if (collisionEvent.safeLanding) {
                level += 1;
                nextLevelAnimation();
            }
            cancelNextRequest = true;
            console.log(myShip.detectCollision(terrain.lines).safeLanding);
        }
    }

    function newLevel() {
        
    }

    function render() {
        graphics.clear();
        renderer.Background.render(myBackground);
        graphics.drawLines(terrain);
        renderer.Ship.render(myShip);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(10);
        update(10);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        let canvas = document.getElementById('myCanvas');
        let mouseCapture = false;
        landerHeight = graphics.canvas.height/10;
    }

    function generateTerrain(safeZones, surfaceRoughness, smallestWidth, safeWidth, maxHeight, canvasWidth) {


        let elevation = [];



        for (let i = 0; i < safeZones; i++) {
            let min, max;
            if (i === 0) {
                min = 0.15 * canvasWidth;
                max = ((1-(safeZones * 0.15)) * canvasWidth) - (safeZones * safeWidth);
            }
            if (i === 1) {
                min = elevation[0].x2 + (0.15 * canvasWidth);
                max = (0.85 * canvasWidth) - safeWidth;
            }
            let randStart = Math.floor(Math.random() * (max - min) + min);
            let randHeight = Math.floor(Math.random() * maxHeight);

            elevation.push({
                "safeZone": true,
                "x1": randStart,
                "x2": randStart + safeWidth,
                "y1": randHeight,
                "y2": randHeight
            });
        }

        let toSplit = [];

        toSplit.push({
            "iteration": 0,
            "safeZone": false,
            "x1": 0,
            "x2": elevation[0].x1,
            "y1": Math.floor(Math.random() * maxHeight),
            "y2": elevation[0].y1
        });

        if (safeZones === 2) {
            toSplit.push({
                "iteration": 0,
                "safeZone": false,
                "x1": elevation[0].x2,
                "x2": elevation[1].x1,
                "y1": elevation[0].y2,
                "y2": elevation[1].y1
            });
        }

        toSplit.push({
            "iteration": 0,
            "safeZone": false,
            "x1": elevation[safeZones-1].x2,
            "x2": myCanvas.width,
            "y1": elevation[safeZones-1].y2,
            "y2": Math.floor(Math.random() * maxHeight)
        });

        while (toSplit.length > 0) {
            let line = toSplit.pop();
            let line1, line2;
            let rand = Math.random() * 2 - 1
            let y = Math.floor(.5 * (line.y1 + line.y2) + ((surfaceRoughness/Math.sqrt(line.iteration)) * rand * Math.abs(line.x2 - line.x1)));
            if (y < 0) y = 0;
            if (y > maxHeight) y = maxHeight;
            line1 = {
                "iteration": line.iteration + 1,
                "safeZone": false,
                "x1": line.x1,
                "x2": Math.floor((line.x2 + line.x1)/2),
                "y1": line.y1,
                "y2": y
            };
            line2 = {
                "iteration": line.iteration + 1,
                "safeZone": false,
                "x1": Math.floor((line.x2 + line.x1)/2),
                "x2": line.x2,
                "y1": y,
                "y2": line.y2
            };
            if (line1.x2 - line.x1 > smallestWidth) toSplit.push(line1);
            else elevation.push(line1);
            if (line2.x2 - line.x1 > smallestWidth) toSplit.push(line2);
            else elevation.push(line2);
        }

        elevation.sort(function(a, b) {
            return a.x1 - b.x1;
        })

        for (let i = 0; i < elevation.length; i++) {
            elevation[i].y1 = myCanvas.height - elevation[i].y1;
            elevation[i].y2 = myCanvas.height - elevation[i].y2;
        }

        return elevation;
    }

    function run() {
        level = 1;
        terrain.lines = generateTerrain(
            3 - level,
            1.5,
            10,
            graphics.canvas.width / 10,
            graphics.canvas.height / 2,
            graphics.canvas.width
        );

        myShip = objects.Ship({
            imageSrc: 'assets/lander.png',
            center: {x: graphics.canvas.width/2, y: graphics.canvas.height/8},
            size: {width: landerRatio*landerHeight, height: landerHeight},
            accelRate: landerHeight / 20000,
            rotateRate: Math.PI / 1000
        });

        myKeyboard = input.Keyboard();
        myKeyboard.register(game.keyBindings.keys.thrust, myShip.accelerate);
        myKeyboard.register(game.keyBindings.keys.lRotate, myShip.rotateLeft);
        myKeyboard.register(game.keyBindings.keys.rRotate, myShip.rotateRight);
        myKeyboard.register('g', function () {
            stop();
        });
        myKeyboard.register('Escape', function () {
            cancelNextRequest = true;
            game.showScreen('main-menu');
        });

        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.main, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));