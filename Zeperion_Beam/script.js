let board;
let bodyPose;
let video;
let poses = [];

let rgb;
let buzzer;

let stage = 0;
let lastPose = 0;
let previousPose = 0;

let result = "";
let resultTime = 0;
let lastFlash = 0;
let flashOn = false;
let flashColor;

async function setup() {
    createCanvas(700, 500);

    video = createCapture(VIDEO);
    video.size(700, 500);
    video.hide();

    console.log("WEBCAM CREATED");

    bodyPose = await ml5.bodyPose();

    console.log("BODYPOSE LOADED");

    bodyPose.detectStart(video, function(results) {
        poses = results;
    });

    console.log("DETECTION STARTED");

    board = createBoard();
    createConnectButton(board);

    board.on("ready", function() {
        rgb = new five.Led.RGB({
            pins: {
                red: 9,
                green: 10,
                blue: 11
            }
        });

        buzzer = new five.Piezo(7);
        rgb.off();

        console.log("ARDUINO CONNECTED");
    });
}

function draw() {
    imageMode(CORNER);

    if (video && video.elt.readyState >= 2) {
        image(video, 0, 0, 700, 500);
    } else {
        background(220);
    }

    // BodyPose
    if (poses.length > 0 && result === "") {

        let pose = poses[0];

        let ls = pose.left_shoulder;
        let rs = pose.right_shoulder;

        let le = pose.left_elbow;
        let re = pose.right_elbow;

        let lw = pose.left_wrist;
        let rw = pose.right_wrist;

        let lh = pose.left_hip;
        let rh = pose.right_hip;

        if (ls && rs && le && re && lw && rw && lh && rh) {

            let distance = dist(
                ls.x, ls.y,
                rs.x, rs.y
            );

            let chestX = (ls.x + rs.x) / 2;
            let chestY = (ls.y + rs.y + lh.y + rh.y) / 4;

            let pose1 =
                dist(lw.x, lw.y, rw.x, rw.y) < distance * 0.35 &&
                abs(lw.x - chestX) < distance * 0.4 &&
                abs(lw.y - chestY) < distance * 0.6;

            let pose2 =
                abs(lw.y - ls.y) < distance * 0.3 &&
                abs(rw.y - rs.y) < distance * 0.3 &&
                dist(lw.x, lw.y, rw.x, rw.y) > distance * 2;

            let leftHorizontal =
                abs(lw.y - le.y) < distance * 0.25 &&
                abs(lw.x - le.x) > distance * 0.35;

            let rightVertical =
                abs(rw.x - re.x) < distance * 0.25 &&
                abs(rw.y - re.y) > distance * 0.35;

            let rightHorizontal =
                abs(rw.y - re.y) < distance * 0.25 &&
                abs(rw.x - re.x) > distance * 0.35;

            let leftVertical =
                abs(lw.x - le.x) < distance * 0.25 &&
                abs(lw.y - le.y) > distance * 0.35;

            let pose3 =
                (leftHorizontal && rightVertical) ||
                (rightHorizontal && leftVertical);

            // Current pose
            let currentPose = 0;

            if (pose1) {
                currentPose = 1;
            } else if (pose2) {
                currentPose = 2;
            } else if (pose3) {
                currentPose = 3;
            }

            if (
                currentPose !== 0 &&
                currentPose !== previousPose &&
                millis() - lastPose > 800
            ) {

                if (currentPose === stage + 1) {
                    stage++;
                    lastPose = millis();

                    if (stage === 3) {
                        result = "SUCCESS";
                        resultTime = millis();
                        lastFlash = 0;
                    }

                } else {
                    result = "FAILED";
                    resultTime = millis();

                    if (rgb) {
                        rgb.color("red");
                    }

                    if (buzzer) {
                        buzzer.frequency(880);
                    }
                }
            }

            previousPose = currentPose;

            fill("red");
            noStroke();
            circle(lw.x, lw.y, 20);
            circle(rw.x, rw.y, 20);

            fill("lime");
            circle(le.x, le.y, 15);
            circle(re.x, re.y, 15);

        } else {
            previousPose = 0;
        }

    } else if (result === "") {
        previousPose = 0;
    }

    if (result === "SUCCESS") {

        if (millis() - lastFlash > 300) {
            flashOn = !flashOn;

            if (flashOn) {
                flashColor = color(
                    random(255),
                    random(255),
                    random(255)
                );

                if (rgb) {
                    rgb.color({
                        red: floor(red(flashColor)),
                        green: floor(green(flashColor)),
                        blue: floor(blue(flashColor))
                    });
                }

            } else {
                if (rgb) {
                    rgb.off();
                }
            }

            lastFlash = millis();
        }

        if (flashOn) {
            background(flashColor);
        }

        fill("white");
        textSize(40);
        text("SPELL CAST!", 200, 250);
    }

    if (result === "FAILED") {
        fill("red");
        textSize(40);
        text("SPELL FAILED!", 180, 250);
    }

    if (result !== "" && millis() - resultTime > 3000) {
        stage = 0;
        result = "";
        previousPose = 0;
        flashOn = false;
        lastPose = millis();

        if (rgb) {
            rgb.off();
        }

        if (buzzer) {
            buzzer.noTone();
        }
    }

    fill("yellow");
    stroke("black");
    strokeWeight(3);
    textSize(25);
    text("Stage: " + stage, 20, 40);
    noStroke();
}
