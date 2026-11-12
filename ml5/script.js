let board;
let bodyPose;
let video;
let poses = [];

async function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    video = createCapture(VIDEO);
    video.size(700, 500);
    video.hide();

    bodyPose = await ml5.bodyPose();
    bodyPose.detectStart(video, function(results) {
        poses = results;
    });
}

function draw() {
    image(video, 0, 0);

    if (poses.length > 0) {
        let pose = poses[0];

        let leftEar = pose.left_ear;
        let leftEye = pose.left_eye;
        let nose = pose.nose;
        let rightEye = pose.right_eye;
        let rightEar = pose.right_ear;

        if (leftEar && leftEye && rightEye && rightEar) {

            stroke("black");
            strokeWeight(8);

            // Connect two eyes
            line(leftEye.x, leftEye.y, rightEye.x, rightEye.y);

            // Connect left eye to left ear
            line(leftEye.x, leftEye.y, leftEar.x, leftEar.y);

            // Connect right eye to right ear
            line(rightEye.x, rightEye.y, rightEar.x, rightEar.y);

            // Black circles
            noStroke();
            fill("black");

            circle(leftEye.x, leftEye.y, 80);
            circle(rightEye.x, rightEye.y, 80);
        }
    }
}