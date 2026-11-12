let board;
let bodyPose;
let video;
let poses = [];
let target = {
    x: 300,
    y: 200,
    d: 50
}

async function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    led = new five.Led(3);

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
    let rw = poses[0].right_wrist;

    let distance = dist(rw.x, rw.y, target.x, target.y);

    let isColliding = distance < target.d;

    textSize(40);
    text(isColliding, 20, 20);

    if (isColliding) {
        fill("#FF0000");
    } else {
        fill("#00FF00");
    }

    circle(target.x, target.y, target.d);

    }
}