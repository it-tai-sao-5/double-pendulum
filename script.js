const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const gravity = 9.81;
const mass1 = 1;
const mass2 = 1;
const length1 = 150;
const length2 = 150;

let angle1;
let angle2;
let velocity1;
let velocity2;

const trail = [];
const MAX_TRAIL = 1500;

function reset() {
    angle1 = Number(document.getElementById("angle1").value) * Math.PI / 180;
    angle2 = Number(document.getElementById("angle2").value) * Math.PI / 180;

    velocity1 = 0;
    velocity2 = 0;

    trail.length = 0;
}

function calculatePhysics(dt) {
    const difference = angle1 - angle2;

    const denominator =
        2 * mass1 +
        mass2 -
        mass2 * Math.cos(2 * difference);

    const acceleration1 =
        (
            -gravity * (2 * mass1 + mass2) * Math.sin(angle1)
            - mass2 * gravity * Math.sin(angle1 - 2 * angle2)
            - 2 * Math.sin(difference) * mass2 *
            (
                velocity2 * velocity2 * length2 +
                velocity1 * velocity1 * length1 * Math.cos(difference)
            )
        ) /
        (length1 * denominator);

    const acceleration2 =
        (
            2 * Math.sin(difference) *
            (
                velocity1 * velocity1 * length1 * (mass1 + mass2)
                + gravity * (mass1 + mass2) * Math.cos(angle1)
                + velocity2 * velocity2 * length2 * mass2 * Math.cos(difference)
            )
        ) /
        (length2 * denominator);

    velocity1 += acceleration1 * dt;
    velocity2 += acceleration2 * dt;

    angle1 += velocity1 * dt;
    angle2 += velocity2 * dt;
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = 100;

    const x1 = originX + length1 * Math.sin(angle1);
    const y1 = originY + length1 * Math.cos(angle1);

    const x2 = x1 + length2 * Math.sin(angle2);
    const y2 = y1 + length2 * Math.cos(angle2);

    trail.push({ x: x2, y: y2 });

    if (trail.length > MAX_TRAIL) {
        trail.shift();
    }

    ctx.beginPath();

    for (let i = 0; i < trail.length; i++) {
        if (i === 0) {
            ctx.moveTo(trail[i].x, trail[i].y);
        } else {
            ctx.lineTo(trail[i].x, trail[i].y);
        }
    }

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 5;
    ctx.stroke();

    drawCircle(originX, originY, 8, "#222");
    drawCircle(x1, y1, 16, "#555");
    drawCircle(x2, y2, 20, "#111");
}

let lastTime = performance.now();

function animate(currentTime) {
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    dt = Math.min(dt, 0.02);

    calculatePhysics(dt);
    draw();

    requestAnimationFrame(animate);
}

document.getElementById("reset").addEventListener("click", reset);

reset();
draw();
requestAnimationFrame(animate);
