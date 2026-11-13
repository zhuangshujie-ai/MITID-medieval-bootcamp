
let board;
let bodyPose;
let video;
let poses = [];

let helmet;
let chestplate;
let leggings;
let sword;
let shield;

let buzzer;

async function setup() {
    createCanvas(700, 500);

    board = createBoard();
    createConnectButton(board);

    board.on("ready", function() {
        buzzer = new five.Piezo(7);
    });

    loadImage("image/diamond_helmet.png", function(img) {
        helmet = img;
    });

    loadImage("image/diamond_chestplate.png", function(img) {
        chestplate = img;
    });

    loadImage("image/diamond_leggings.png", function(img) {
        leggings = img;
    });

    loadImage("image/diamond_sword.png", function(img) {
        sword = img;
    });

    loadImage("image/shield.png", function(img) {
        shield = img;
    });

    video = createCapture(VIDEO);
    video.size(700, 500);
    video.hide();

    bodyPose = await ml5.bodyPose();
    bodyPose.detectStart(video, function(results) {
        poses = results;
    });
}

function draw() {
    imageMode(CORNER);
    image(video, 0, 0);

    if (poses.length > 0) {
        let pose = poses[0];

        let nose = pose.nose;
        let leftEar = pose.left_ear;
        let rightEar = pose.right_ear;

        let leftShoulder = pose.left_shoulder;
        let rightShoulder = pose.right_shoulder;

        let leftWrist = pose.left_wrist;
        let rightWrist = pose.right_wrist;

        let leftHip = pose.left_hip;
        let rightHip = pose.right_hip;

        let leftKnee = pose.left_knee;
        let rightKnee = pose.right_knee;

        imageMode(CENTER);

        if (helmet && leftEar && rightEar && nose) {

            let headWidth = dist(
                leftEar.x, leftEar.y,
                rightEar.x, rightEar.y
            );

            let headX = (leftEar.x + rightEar.x) / 2;
            let headY = nose.y - headWidth * 0.25;

            image(
                helmet,
                headX,
                headY,
                headWidth * 1.6,
                headWidth * 1.6
            );
        }

        if (chestplate && leftShoulder && rightShoulder &&
            leftHip && rightHip) {

            let shoulderWidth = dist(
                leftShoulder.x, leftShoulder.y,
                rightShoulder.x, rightShoulder.y
            );

            let shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
            let hipY = (leftHip.y + rightHip.y) / 2;
            let bodyHeight = dist(
                (leftShoulder.x + rightShoulder.x) / 2,
                shoulderY,
                (leftHip.x + rightHip.x) / 2,
                hipY
            );

            let chestX = (leftShoulder.x + rightShoulder.x) / 2;
            let chestY = (shoulderY + hipY) / 2;

            image(
                chestplate,
                chestX,
                chestY,
                shoulderWidth * 1.3,
                bodyHeight * 1.15
            );
        }

        if (leggings && leftHip && rightHip &&
            leftKnee && rightKnee) {

            let hipWidth = dist(
                leftHip.x, leftHip.y,
                rightHip.x, rightHip.y
            );

            let hipY = (leftHip.y + rightHip.y) / 2;
            let kneeY = (leftKnee.y + rightKnee.y) / 2;

            let legHeight = abs(kneeY - hipY);

            let legX = (leftHip.x + rightHip.x) / 2;
            let legY = (hipY + kneeY) / 2;

            image(
                leggings,
                legX,
                legY,
                hipWidth * 1.8,
                legHeight * 1.8
            );
        }

        if (sword && leftShoulder && rightShoulder && rightWrist) {

            let shoulderWidth = dist(
                leftShoulder.x, leftShoulder.y,
                rightShoulder.x, rightShoulder.y
            );

            let swordSize = shoulderWidth * 0.9;

            image(
                sword,
                rightWrist.x,
                rightWrist.y - swordSize * 0.3,
                swordSize,
                swordSize
            );
        }

        if (shield && leftShoulder && rightShoulder && leftWrist) {

            let shoulderWidth = dist(
                leftShoulder.x, leftShoulder.y,
                rightShoulder.x, rightShoulder.y
            );

            let shieldWidth = shoulderWidth * 0.8;
            let shieldHeight = shieldWidth * 1.5;

            image(
                shield,
                leftWrist.x,
                leftWrist.y,
                shieldWidth,
                shieldHeight
            );
        }

        if (buzzer && leftWrist && rightWrist &&
            leftShoulder && rightShoulder) {

            if (
                leftWrist.y < leftShoulder.y &&
                rightWrist.y < rightShoulder.y
            ) {
                buzzer.frequency(440);
            } else {
                buzzer.noTone();
            }
        }

    } else {
        if (buzzer) {
            buzzer.noTone();
        }
    }
}
