MyGame.objects.Ship = function(spec) {
    'use strict';

    let rotation = 90;
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    }

    function updateRotation(howMuch) {
        rotation += howMuch;
    }

    function moveForward (howMuch) {

    }
}