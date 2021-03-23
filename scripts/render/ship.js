MyGame.render.Ship = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
            graphics.drawText({
                font: '20px Courier',
                fillStyle: 'white',
                strokeStyle: 'white',
                position: {x: 10, y: 10},
                rotation: 0,
                text: 'fuel  : ' + spec.fuel.toFixed(2) + ' s'
            });
            graphics.drawText({
                font: '20px Courier',
                fillStyle: 'white',
                strokeStyle: 'white',
                position: {x: 10, y: 40},
                rotation: 0,
                text: 'speed : ' + spec.velocity.toFixed(3) + ' m/s'
            });
            graphics.drawText({
                font: '20px Courier',
                fillStyle: 'white',
                strokeStyle: 'white',
                position: {x: 10, y: 70},
                rotation: 0,
                text: 'angle : ' + (spec.rotation*180/Math.PI).toFixed(2) + String.fromCharCode(176)
            });
        }
    }

    return {
        render : render
    };
}(MyGame.graphics));