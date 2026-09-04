const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let x = 400;
let y = 300;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(400, 100);
    ctx.lineTo(x, y);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);

    ctx.fillStyle = "red";
    ctx.fill();
}

draw();
