```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const gravity = 9.81;

const m1 = 1;
const m2 = 1;

const l1 = 150;
const l2 = 150;

let angle1;
let angle2;

let velocity1 = 0;
let velocity2 = 0;

let trail = [];

let lastTime = performance.now();

function reset() {
    angle1 =
        Number(document.getElementById("angle1").value)
        * Math.PI / 180;

    angle2 =
        Number(document.getElementById("angle2").value)
        * Math.PI / 180;

    velocity1 = 0;
    velocity2 = 0;

    trail = [];
}

function update(dt) {
    const difference = angle1 - angle2;

    const denominator1 =
        l1 * (
            2 * m1 +
            m2 -
            m2 * Math.cos(2 * angle1 - 2 * angle2)
        );

    const acceleration1 =
        (
            -gravity * (2 * m1 + m2) * Math.sin(angle1)
            -m2 * gravity * Math.sin(angle1 - 2 * angle2)
            -2 * Math.sin(difference) * m2 *
            (
                velocity2 * velocity2 * l2 +
                velocity1 * velocity1 * l1 *
                Math.cos(difference)
            )
        ) / denominator1;

    const denominator2 =
        l2 * (
            2 * m1 +
            m2 -
            m2 * Math.cos(2 * angle1 - 2 * angle2)
        );

    const acceleration2 =
        (
            2 * Math.sin(difference) *
            (
                velocity1 * velocity1 * l1 * (m1 + m2)
                + gravity * (m1 + m2) * Math.cos(angle1)
                + velocity2 * velocity2 * l2 * m2 *
                Math.cos(difference)
            )
        ) / denominator2;

    velocity1 += acceleration1 * dt;
    velocity2 += acceleration2 * dt;

    angle1 += velocity1 * dt;
    angle2 += velocity2 * dt;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = 100;

    const x1 =
        originX + l1 * Math.sin(angle1);

    const y1 =
        originY + l1 * Math.cos(angle1);

    const x2 =
        x1 + l2 * Math.sin(angle2);

    const y2 =
        y1 + l2 * Math.cos(angle2);

    // Quỹ đạo
    trail.push({
        x: x2,
        y: y2
    });

    if (trail.length > 1200) {
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

    // Thanh 1 + thanh 2
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Điểm treo
    ctx.beginPath();
    ctx.arc(originX, originY, 7, 0, Math.PI * 2);

    ctx.fillStyle = "#222";
    ctx.fill();

    // Quả 1
    ctx.beginPath();
    ctx.arc(x1, y1, 15, 0, Math.PI * 2);

    ctx.fillStyle = "#444";
    ctx.fill();

    // Quả 2
    ctx.beginPath();
    ctx.arc(x2, y2, 18, 0, Math.PI * 2);

    ctx.fillStyle = "#111";
    ctx.fill();
}

function animate(time) {
    let dt = (time - lastTime) / 1000;

    lastTime = time;

    // Tránh nhảy vật lý nếu tab bị lag
    dt = Math.min(dt, 0.02);

    update(dt);
    draw();

    requestAnimationFrame(animate);
}

document
    .getElementById("reset")
    .addEventListener("click", reset);

reset();

requestAnimationFrame(animate);
```
