```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// ======================
// VẬT LÝ
// ======================

const g = 9.81;

const m1 = 1;
const m2 = 1;

const L1 = 150;
const L2 = 150;

// Góc ban đầu
let a1 = 120 * Math.PI / 180;
let a2 = 120 * Math.PI / 180;

// Vận tốc góc
let v1 = 0;
let v2 = 0;


// ======================
// RESET
// ======================

function reset() {
    a1 =
        Number(document.getElementById("angle1").value)
        * Math.PI / 180;

    a2 =
        Number(document.getElementById("angle2").value)
        * Math.PI / 180;

    v1 = 0;
    v2 = 0;

    trail.length = 0;
}


// ======================
// QUỸ ĐẠO
// ======================

const trail = [];
const maxTrail = 1000;


// ======================
// PHƯƠNG TRÌNH CON LẮC
// ======================

function physics(dt) {

    const sin1 = Math.sin(a1);
    const sin2 = Math.sin(a2);

    const cos1 = Math.cos(a1);
    const cos2 = Math.cos(a2);

    const difference = a1 - a2;

    const sinDiff = Math.sin(difference);
    const cosDiff = Math.cos(difference);

    const denominator =
        2 * m1 +
        m2 -
        m2 * Math.cos(2 * difference);


    // Gia tốc góc 1

    const acc1 =
        (
            -g * (2 * m1 + m2) * sin1
            -m2 * g * Math.sin(a1 - 2 * a2)
            -2 * sinDiff * m2 *
            (
                v2 * v2 * L2
                + v1 * v1 * L1 * cosDiff
            )
        )
        /
        (L1 * denominator);


    // Gia tốc góc 2

    const acc2 =
        (
            2 * sinDiff *
            (
                v1 * v1 * L1 * (m1 + m2)
                +g * (m1 + m2) * cos1
                +v2 * v2 * L2 * m2 * cosDiff
            )
        )
        /
        (L2 * denominator);


    // Cập nhật vận tốc

    v1 += acc1 * dt;
    v2 += acc2 * dt;


    // Cập nhật góc

    a1 += v1 * dt;
    a2 += v2 * dt;
}


// ======================
// VẼ
// ======================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const originX = 400;
    const originY = 100;


    // Quả 1

    const x1 =
        originX +
        L1 * Math.sin(a1);

    const y1 =
        originY +
        L1 * Math.cos(a1);


    // Quả 2

    const x2 =
        x1 +
        L2 * Math.sin(a2);

    const y2 =
        y1 +
        L2 * Math.cos(a2);


    // ======================
    // QUỸ ĐẠO
    // ======================

    trail.push({
        x: x2,
        y: y2
    });

    if (trail.length > maxTrail) {
        trail.shift();
    }

    ctx.beginPath();

    for (let i = 0; i < trail.length; i++) {

        if (i === 0) {
            ctx.moveTo(
                trail[i].x,
                trail[i].y
            );
        } else {
            ctx.lineTo(
                trail[i].x,
                trail[i].y
            );
        }
    }

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.stroke();


    // ======================
    // THANH
    // ======================

    ctx.beginPath();

    ctx.moveTo(
        originX,
        originY
    );

    ctx.lineTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 5;

    ctx.stroke();


    // ======================
    // ĐIỂM TREO
    // ======================

    circle(
        originX,
        originY,
        8,
        "#222"
    );


    // ======================
    // QUẢ 1
    // ======================

    circle(
        x1,
        y1,
        16,
        "#555"
    );


    // ======================
    // QUẢ 2
    // ======================

    circle(
        x2,
        y2,
        20,
        "#111"
    );
}


// ======================
// VẼ HÌNH TRÒN
// ======================

function circle(x, y, radius, color) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();
}


// ======================
// GAME LOOP
// ======================

let previousTime = performance.now();

function animate(time) {

    let dt =
        (time - previousTime) / 1000;

    previousTime = time;

    // Không để game bị nhảy quá xa khi lag
    dt = Math.min(dt, 0.02);

    physics(dt);
    draw();

    requestAnimationFrame(animate);
}


// ======================
// RESET BUTTON
// ======================

document
    .getElementById("reset")
    .addEventListener(
        "click",
        reset
    );


// ======================
// START
// ======================

reset();

requestAnimationFrame(animate);
```
