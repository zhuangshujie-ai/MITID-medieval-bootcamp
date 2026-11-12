let board;
let led;

function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);
    
    led = new five.Led(3);

    led.on();
    led.off();

}

function draw() {
    background(200);
 //   if(mouseX < width/2) {
 //       led.on();
 //   } else {
 //       led.off();
 //   }

    let brightnessValue = map(mouseX, 0, width, 0, 255);

    led.brightness(brightnessValue);

}
    function mousePressed() {
        led.toggle();
    }