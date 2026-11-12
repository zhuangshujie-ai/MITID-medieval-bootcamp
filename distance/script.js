let board;
let bodyPose;
let video;
let poses = [];
let led;

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
    let lw = poses[0].left_wrist;

    let distance = parseInt(dist(rw.x, rw.y, lw.x, lw.y));

    text(distance, 10, 10);

    let bri = map(distance, 30, 500, 0, 255);
    led.brightness(bri);
    }
}