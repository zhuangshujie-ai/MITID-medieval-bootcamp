let board;
let bodyPose;
let video;
let poses = [];
let lcd;

async function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    board.on("ready", function() {
        lcd = new five.LCD({
            controller: "PCF8574"
        });

        lcd.clear();
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
    image(video, 0, 0);

    if (poses.length > 0) {
        let rw = poses[0].right_wrist;

        fill("red");
        noStroke();
        circle(rw.x, rw.y, 30);

        let column = floor(map(rw.x, 0, 700, 0, 16));
        let row = floor(map(rw.y, 0, 500, 0, 2));

        if (lcd) {
            lcd.clear();
            lcd.cursor(row, column);
            lcd.print("A");
        }
    }
}