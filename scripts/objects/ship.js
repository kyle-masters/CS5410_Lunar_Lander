MyGame.objects.Ship = function(spec) {
    'use strict';

    let rotation = Math.PI/2;
    let imageReady = false;
    let image = new Image();
    let gravity = spec.size.height / 30000;
    let accelX = 0;
    let accelY = gravity;
    let velocX = 0;
    let velocY = 0;
    let exteriorPoints = {};

    image.onload = function() {
        imageReady = true;
    }
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        rotation -= (elapsedTime * spec.rotateRate);
        if (rotation < 0) rotation += 2 * Math.PI;
    }

    function rotateRight(elapsedTime) {
        rotation += (elapsedTime * spec.rotateRate);
        if (rotation >= 2 * Math.PI) rotation -= 2 * Math.PI;
    }

    function accelerate(elapsedTime) {
        accelX = (spec.accelRate * Math.sin(rotation));
        accelY = -(spec.accelRate * Math.cos(rotation));
        velocX += elapsedTime * accelX;
        velocY += elapsedTime * accelY;
        accelX = 0;
        accelY = gravity;
    }

    function makeMovement (elapsedTime) {
        velocX += elapsedTime * accelX;
        velocY += elapsedTime * accelY;
        spec.center.x += velocX;
        spec.center.y += velocY;
        exteriorPoints = createPoints();
    }

    function createPoints() {
        let widthAngle = 2 * Math.atan(spec.size.width/spec.size.height);
        let distance = (spec.size.width / 2) / Math.sin(Math.atan(spec.size.width/spec.size.height));
        let angle1 = (Math.PI / 2) - rotation - (widthAngle / 2);
        let angle2 = angle1 + widthAngle;
        let angle3 = angle1 + Math.PI;
        let angle4 = angle1 + Math.PI + widthAngle;
        let point1 = {
            x: spec.center.x + (Math.cos(angle1) * distance),
            y: spec.center.y + (Math.sin(angle1) * distance)
        };
        let point2 = {
            x: spec.center.x + (Math.cos(angle2) * distance),
            y: spec.center.y + (Math.sin(angle2) * distance)
        };
        let point3 = {
            x: spec.center.x + (Math.cos(angle3) * distance),
            y: spec.center.y + (Math.sin(angle3) * distance)
        };
        let point4 = {
            x: spec.center.x + (Math.cos(angle4) * distance),
            y: spec.center.y + (Math.sin(angle4) * distance)
        };
        if (rotation >= 0 && rotation < Math.PI/2) return {p1: point3, p2: point4, p3: point1};
        else if (rotation >= Math.PI/2 && rotation < Math.PI) return {p1: point4, p2: point1, p3: point2};
        else if (rotation >= Math.PI && rotation < 3*Math.PI/2) return {p1: point1, p2: point2, p3: point3};
        else if (rotation >= 3*Math.PI/2 && rotation < 2*Math.PI) return {p1: point2, p2: point3, p4: point4};
        else throw 'Rotation is not within acceptable parameters';

    }

    function detectCollision(lines) {
        lines.find(element =>
            element.x1 < exteriorPoints.p1.x

        )

        // Find line that falls between <p1 and p1-p2
        // Find all lines that only fall in p1-p2
        // Find line that falls in p1-p2 && p2-p3
        // Find all lines that only fall in p2-p3
        // Find line that falls between p2-p3 and >p3

        // Loop through and check if any collision happens
        // To do this, create lines for each set of points, and then find their intersection point.
        // If that point falls between the start and send points of EACH LINE being tested, there is a collision.
    }

    function findIntersectionPoint(line1, line2) {
        let pointX = (line2.b - line1.b) / (line1.m - line2.m);
        let pointY = (line1.m * pointX) + line1.b;
        return {x: pointX, y: pointY};
    }

    function createLine(p1, p2) {
        let slope = (p2.x - p1.x) / (p2.y - p1.y);
        let yIntercept = p1.y - (slope * p1.x);
        return {m: slope, b: yIntercept};
    }

    let api = {
        detectCollision : detectCollision,
        makeMovement : makeMovement,
        rotateLeft : rotateLeft,
        rotateRight : rotateRight,
        accelerate : accelerate,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}
