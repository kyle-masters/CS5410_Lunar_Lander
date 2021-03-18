MyGame.objects.Ship = function(spec) {
    'use strict';

    let rotation = Math.PI/2;
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    }
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        rotation -= (elapsedTime * spec.rotateRate);
        if (rotation <= -2 * Math.PI) rotation += 2 * Math.PI;
    }

    function rotateRight(elapsedTime) {
        rotation += (elapsedTime * spec.rotateRate);
        if (rotation >= 2 * Math.PI) rotation -= 2 * Math.PI;
    }

    function moveForward (elapsedTime) {
        spec.center.x += (elapsedTime * spec.maxMoveRate * Math.sin(rotation));
        spec.center.y -= (elapsedTime * spec.maxMoveRate * Math.cos(rotation));
    }

    let api = {
        rotateLeft : rotateLeft,
        rotateRight : rotateRight,
        moveForward : moveForward,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}
