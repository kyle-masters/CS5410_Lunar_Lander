MyGame.objects.Background = function(spec) {
    'use strict';

    let rotation = 0;
    let imageReady = false;
    let image = new Image();

    image.onload = function () {
        imageReady = true;
    }
    image.src = spec.imageSrc;

    let api = {
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}