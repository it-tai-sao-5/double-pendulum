```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const g = 9.81;

let m1 = 1;
let m2 = 1;

let l1 = 150;
let l2 = 150;

let a1;
let a2;

let a1_v = 0;
let a2_v = 0;

let lastTime = performance.now();

const trail = [];

function reset() {
    a1 = Number(document.getElementById("angle1").value) * Math.PI / 180;
    a2 = Number(document.getElementById("angle2").value) * Math.PI / 180;

    a1_v = 0;
    a2_v = 0;

    trail.length = 0;
}

function physics(dt) {
    const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    const num3 = -2 * Math.sin(a1 - a2) * m2;

    const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

    const a1_acc =
        (num1 + num2 + num3 *
        (a2_v * a2_v * l2 +
        a1_v * a1_v * l1 * Math.cos(a1 - a2)))
        / den1;

    const num4 = 2 * Math.sin(a1 - a2);

    const num5 = a1_v * a1_v * l1 * (m1 + m2);

    const num6 = g * (m1 + m2) * Math.cos(a1);

    const num7 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);

    const den2 = l2 * (2 * m1 + m2 -
        m2 * Math.cos(2 * a1 - 2 * a2));

    const a2_acc =
        num4 * (num5 + num6 + num7) / den2;

    a1_v += a1_acc * dt;
    a2_v += a2_acc * dt;

    a1 += a1_v * dt;
    a2 += a2_v * dt;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = 150;

    const x1 = originX + l1 * Math.sin(a1);
    const y1 = originY + l1 * Math.cos(a1);

    const x2 = x1 + l2 * Math.sin(a2);
    const y2 = y1 + l2 * Math.cos(a2);

    // Trail
    trail.push({ x: x2, y: y2 });

    if (trail.length > 1500) {
        trail.shift();
    }

    ctx.beginPath();

    for (let i = 0; i < trail.length; i++) {
        const p = trail[i];

        if (i === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            ctx.lineTo(p.x, p.y);
        }
    }

    ctx.strokeStyle = "#777";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rods
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    // First mass
    ctx.beginPath();
    ctx.arc(x1, y1, 12, 0, Math.PI * 2);

    ctx.fillStyle = "white";
    ctx.fill();

    // Second mass
    ctx.beginPath();
    ctx.arc(x2, y2, 15, 0, Math.PI * 2);

    ctx.fillStyle = "white";
    ctx.fill();

    // Pivot
    ctx.beginPath();
    ctx.arc(originX, originY, 6, 0, Math.PI * 2);

    ctx.fillStyle = "white";
    ctx.fill();
}

function animate(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.02);
    lastTime = time;

    physics(dt);
    draw();

    requestAnimationFrame(animate);
}

document.getElementById("reset").addEventListener("click", reset);

reset();
requestAnimationFrame(animate);
```
