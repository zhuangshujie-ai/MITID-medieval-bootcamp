let board;
let servo;
let potentiometer;
let potValue = 0;

function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);
    
    potentiometer = new five.Sensor({
        pin: "A0",
        scale: [0, 180]
});
    servo = new five.Servo(3); 

    potentiometer.on("change", function(latestValue) {
    servo.to(latestValue);
    })
}
    
  

    


function draw() {
    background(200);

}