let board;
let handPose;
let video;
let hands = [];

let green;
let blue;
let yellow;
let red;
let white;

async function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    board.on("ready", function() {
        green = new five.Led(6);
        blue = new five.Led(5);
        yellow = new five.Led(4);
        red = new five.Led(3);
        white = new five.Led(2);
    });

    video = createCapture(VIDEO);
    video.size(700, 500);
    video.hide();

    handPose = await ml5.handPose();
    handPose.detectStart(video, function(results) {
        hands = results;
    });
}

function draw() {
    image(video, 0, 0);

    if (hands.length > 0) {
        let hand = hands[0];

        fill("red");
        noStroke();

        circle(hand.thumb_tip.x, hand.thumb_tip.y, 20);
        circle(hand.index_finger_tip.x, hand.index_finger_tip.y, 20);
        circle(hand.middle_finger_tip.x, hand.middle_finger_tip.y, 20);
        circle(hand.ring_finger_tip.x, hand.ring_finger_tip.y, 20);
        circle(hand.pinky_finger_tip.x, hand.pinky_finger_tip.y, 20);

        if (green && blue && yellow && red && white) {

            let distance = dist(
                hand.thumb_tip.x, hand.thumb_tip.y,
                hand.wrist.x, hand.wrist.y
            );

            if (distance > 100) {
                green.on();
            } else {
                green.off();
            }

            distance = dist(
                hand.index_finger_tip.x, hand.index_finger_tip.y,
                hand.wrist.x, hand.wrist.y
            );

            if (distance > 100) {
                blue.on();
            } else {
                blue.off();
            }

            distance = dist(
                hand.middle_finger_tip.x, hand.middle_finger_tip.y,
                hand.wrist.x, hand.wrist.y
            );

            if (distance > 100) {
                yellow.on();
            } else {
                yellow.off();
            }

            distance = dist(
                hand.ring_finger_tip.x, hand.ring_finger_tip.y,
                hand.wrist.x, hand.wrist.y
            );

            if (distance > 100) {
                red.on();
            } else {
                red.off();
            }

            distance = dist(
                hand.pinky_finger_tip.x, hand.pinky_finger_tip.y,
                hand.wrist.x, hand.wrist.y
            );

            if (distance > 100) {
                white.on();
            } else {
                white.off();
            }
        }
    } else {
        if (green && blue && yellow && red && white) {
            green.off();
            blue.off();
            yellow.off();
            red.off();
            white.off();
        }
    }
}