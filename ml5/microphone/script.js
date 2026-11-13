let board;
let microphone;
let micValue = 0;

function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    microphone = new five.Sensor("A0");
    microphone.on("change", function(latestValue) {
        micValue = latestValue;
    });

}

function draw() {
    background(200);

    circle(width/2, height/2, micValue);

}