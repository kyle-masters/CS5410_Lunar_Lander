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
    let velocity = 0;
    let exteriorPoints = [];
    let fuel = 20.0;

    image.onload = function() {
        imageReady = true;
    };

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
        if (fuel > elapsedTime/1000) {
            fuel -= elapsedTime/1000;
            velocX += elapsedTime * accelX;
            velocY += elapsedTime * accelY;
        }
        else {
            let timeLeft = fuel/1000;
            fuel = 0;
            velocX += timeLeft * accelX;
            velocY += timeLeft * accelY;
        }
        accelX = 0;
        accelY = gravity;
    }

    function makeMovement (elapsedTime) {
        velocX += elapsedTime * accelX;
        velocY += elapsedTime * accelY;
        velocity = Math.sqrt((velocX*velocX)+(velocY*velocY));
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
            y: spec.center.y - (Math.sin(angle1) * distance)
        };
        let point2 = {
            x: spec.center.x + (Math.cos(angle2) * distance),
            y: spec.center.y - (Math.sin(angle2) * distance)
        };
        let point3 = {
            x: spec.center.x + (Math.cos(angle3) * distance),
            y: spec.center.y - (Math.sin(angle3) * distance)
        };
        let point4 = {
            x: spec.center.x + (Math.cos(angle4) * distance),
            y: spec.center.y - (Math.sin(angle4) * distance)
        };

        return [point1, point2, point3, point4];
        let points = [point1, point2, point3, point4].sort(function(a, b) {
           if (a.y < b.y) return 1;
           else return -1;
        });
        let sliceInt;
        if (Math.abs(points[0].x - points[1].x) === spec.size.width || Math.abs(points[0].x - points[1].x) === spec.size.height) {
            sliceInt = 2;
        }
        else sliceInt = 1;
        points =  points.slice(sliceInt, points.length).sort(function(a, b) {
            if (a.x > b.x) return 1;
            else return -1;
        });
        return points;

        // if (rotation >= 0 && rotation < Math.PI/2) return [point3, point2, point1];
        // else if (rotation >= Math.PI/2 && rotation < Math.PI) return [point2, point1, point4];
        // else if (rotation >= Math.PI && rotation < 3*Math.PI/2) return [point1, point4, point3];
        // else if (rotation >= 3*Math.PI/2 && rotation < 2*Math.PI) return [point4, point3, point2];
        // else {
        //     console.log('Rotation is not within acceptable parameters');
        //     throw 'Rotation is not within acceptable parameters';
        // }
    }

    function detectCollision(lines) {
        let collisionLineData = [];

        collisionLineData = lines.filter(function (element) {
            let minX = -1;
            let maxX = -1;
            for (let i = 0; i < exteriorPoints.length; i++) {
                if (minX === -1 || exteriorPoints[i].x < minX) minX = exteriorPoints[i].x;
                if (maxX === -1 || exteriorPoints[i].x > maxX) maxX = exteriorPoints[i].x;
            }
            return ((element.x1 >= minX && element.x1 <= maxX) ||
                (element.x2 >= minX && element.x2 <= maxX) ||
                (element.x1 <= minX && element.x2 >= maxX));
        });

        let shipLines = [];

        for (let i = 0; i < exteriorPoints.length; i++) {
            shipLines.push(createLine(exteriorPoints[i], exteriorPoints[(i+1)%exteriorPoints.length], false));
        }

        let collisionLines = [];
        for (let i = 0; i < collisionLineData.length; i++) {
            let line = createLine(
                {x: collisionLineData[i].x1, y: collisionLineData[i].y1},
                {x: collisionLineData[i].x2, y: collisionLineData[i].y2},
                collisionLineData[i].safeZone
                );
            let points = exteriorPoints.filter(function(element) {
                return element.x <= line.x1 && element.x >= line.x2;
            });
            for (let j = 0; j < points.length; j++) {
                if (points[j].y >= (line.m * points[j].x) + line.b) {
                    if ((rotation < Math.PI/36 || rotation > 71 * Math.PI / 36) &&
                        velocity < 2) {
                        let landingLine = shipLines.sort(function(a,b) {
                            if (a.yMid < b.yMid) return  1;
                            else return -1;
                        })[0];
                        if (landingLine.x1 >= line.x1 && landingLine.x1 <= line.x2 &&
                            landingLine.x2 >= line.x1 && landingLine.x2 <= line.x2 &&
                            line.safe === true) {
                            return {collision: true, safeLanding: true};
                        }
                        else return {collision: true, safeLanding: false};
                    }
                    else return {collision: true, safeLanding: false};
                }
            }
            collisionLines.push(line);
        }

        for (let i = 0; i < collisionLines.length; i++) {
            for (let j = 0; j < shipLines.length; j++) {
                if ((shipLines[j].x1 >= collisionLines[i].x1 && shipLines[j].x1 <= collisionLines[i].x2) ||
                    (shipLines[j].x2 >= collisionLines[i].x1 && shipLines[j].x2 <= collisionLines[i].x2) ||
                    (collisionLines[i].x1 >= shipLines[j].x1 && collisionLines[i].x1 <= shipLines[j].x2) ||
                    (collisionLines[i].x2 >= shipLines[j].x1 && collisionLines[i].x2 <= shipLines[j].x2)) {
                    let intersectPoint = findIntersectionPoint(collisionLines[i], shipLines[j]);
                    if ((intersectPoint.x >= collisionLines[i].x1 && intersectPoint.x <= collisionLines[i].x2) &&
                        (intersectPoint.x >= shipLines[j].x1 && intersectPoint.x <= shipLines[j].x2)) {
                        if ((rotation < Math.PI/36 || rotation > 71 * Math.PI / 36) &&
                            velocity < 2) {
                            let landingLine = shipLines.sort(function(a,b) {
                                if (a.yMid < b.yMid) return  1;
                                else return -1;
                            })[0];
                            if (landingLine.x1 >= collisionLines[i].x1 && landingLine.x1 <= collisionLines[i].x2 &&
                                landingLine.x2 >= collisionLines[i].x1 && landingLine.x2 <= collisionLines[i].x2 &&
                                collisionLines[i].safe === true) {
                                return {collision: true, safeLanding: true};
                            }
                            else return {collision: true, safeLanding: false};
                        }
                        else return {collision: true, safeLanding: false};
                    }
                }
            }
        }

        return {collision: false};
    }

    function findYatX(line, x) {

    }

    function findIntersectionPoint(line1, line2) {
        let pointX = (line2.b - line1.b) / (line1.m - line2.m);
        let pointY = (line1.m * pointX) + line1.b;
        return {x: pointX, y: pointY};
    }

    function createLine(p1, p2, safe) {
        let slope = (p2.y - p1.y) / (p2.x - p1.x);
        let yIntercept = p1.y - (slope * p1.x);
        return {m: slope, b: yIntercept, x1: p1.x, x2: p2.x, safe: safe, yMid: (p1.y +p2.y)/2};
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
        get size() { return spec.size; },
        get velocity() { return velocY; },
        get fuel() { return fuel; }
    };

    return api;
}
