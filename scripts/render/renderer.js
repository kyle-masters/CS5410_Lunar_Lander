MyGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width/2,
            center.y - size.height/2,
            size.width,
            size.height
        );

        context.restore();
    }

    function drawText(spec) {
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);

        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    function drawLines(spec) {
        context.save();

        context.strokeStyle = spec.strokeStyle;
        context.lineWidth = spec.lineWidth;
        context.fillStyle = spec.fillStyle;

        context.beginPath();
        context.moveTo(spec.lines[0].x1, spec.lines[0].y1);
        for (let i = 0; i < spec.lines.length; i++) {
            context.lineTo(spec.lines[i].x2, spec.lines[i].y2);
        }
        context.stroke();
        context.lineTo(spec.lines[spec.lines.length - 1].x2, canvas.height);
        context.lineTo(spec.lines[0].x1, canvas.height);
        context.closePath();
        context.fill();

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear : clear,
        drawTexture : drawTexture,
        drawText : drawText,
        drawLines : drawLines
    };

    return api;
}());