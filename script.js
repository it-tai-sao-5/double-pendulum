```javascript
// ================================
// DOUBLE PENDULUM
// ================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ----------------
// Canvas
// ----------------

canvas.width = 800;
canvas.height = 600;


// ----------------
// Vật lý
// ----------------

const gravity = 9.81;

const mass1 = 1;
const mass2 = 1;

const length1 = 150;
const length2 = 150;


// ----------------
// Trạng thái
// ----------------

let angle1 = 0;
let angle2 = 0;

let velocity1 = 0;
let velocity2 = 0;


// ----------------
// Quỹ đạo
// ----------------

const trail = [];

const MAX_TRAIL = 1500;


// ----------------
// Reset
// ----------------

function reset() {

    const input1 = document.getElementById("angle1");
    const input2 = document.getElementById("angle2");

    angle1 = Number(input1.value) * Math.PI / 180;
    angle2 = Number(input2.value) * Math.PI / 180;

    velocity1 = 0;
    velocity2 = 0;

    trail.length = 0;
}


// ----------------
// Tính gia tốc
// ----------------

function calculatePhysics(dt) {

    const difference = angle1 - angle2;

    const denominator =
        2 * mass1 +
        mass2 -
        mass2 * Math.cos(2 * difference);


    // Gia tốc thanh 1

    const acceleration1 =
        (
            -gravity *
            (2 * mass1 + mass2) *
            Math.sin(angle1)

            - mass2 *
            gravity *
            Math.sin(angle1 - 2 * angle2)

            - 2 *
            Math.sin(difference) *
            mass2 *
            (
                velocity2 * velocity2 * length2

                + velocity1 * velocity1 *
                length1 *
                Math.cos(difference)
            )

        )
        /
        (
            length1 * denominator
        );


    // Gia tốc thanh 2

    const acceleration2 =
        (
            2 *
            Math.sin(difference)
            *
            (
                velocity1 * velocity1 *
                length1 *
                (mass1 + mass2)

                + gravity *
                (mass1 + mass2) *
                Math.cos(angle1)

                + velocity2 * velocity2 *
                length2 *
                mass2 *
                Math.cos(difference)
            )
        )
        /
        (
            length2 * denominator
        );


    // Cập nhật vận tốc

    velocity1 += acceleration1 * dt;
    velocity2 += acceleration2 * dt;


    // Cập nhật góc

    angle1 += velocity1 * dt;
    angle2 += velocity2 * dt;
}


// ----------------
// Vẽ
// ----------------

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Điểm treo

    const originX = canvas.width / 2;
    const originY = 100;


    // Quả thứ nhất

    const x1 =
        originX +
        length1 *
        Math.sin(angle1);

    const y1 =
        originY +
        length1 *
        Math.cos(angle1);


    // Quả thứ hai

    const x2 =
        x1 +
        length2 *
        Math.sin(angle2);

    const y2 =
        y1 +
        length2 *
        Math.cos(angle2);


    // ----------------
    // Quỹ đạo
    // ----------------

    trail.push({
        x: x2,
        y: y2
    });


    if (trail.length > MAX_TRAIL) {
        trail.shift();
    }


    ctx.beginPath();

    for (let i = 0; i < trail.length; i++) {

        const point = trail[i];

        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        }
        else {
            ctx.lineTo(point.x, point.y);
        }
    }

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;

    ctx.stroke();


    // ----------------
    // Hai thanh
    // ----------------

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
    ctx.lineWidth = 4;

    ctx.stroke();


    // ----------------
    // Điểm treo
    // ----------------

    drawCircle(
        originX,
        originY,
        7,
        "#222"
    );


    // ----------------
    // Quả 1
    // ----------------

    drawCircle(
        x1,
        y1,
        15,
        "#555"
    );


    // ----------------
    // Quả 2
    // ----------------

    drawCircle(
        x2,
        y2,
        18,
        "#111"
    );
}


// ----------------
// Vẽ hình tròn
// ----------------

function drawCircle(x, y, radius, color) {

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


// ----------------
// Game loop
// ----------------

let lastTime = performance.now();

function animate(currentTime) {

    let dt =
        (currentTime - lastTime)
        / 1000;

    lastTime = currentTime;


    // Không cho dt quá lớn
    // khi tab bị lag

    dt = Math.min(
        dt,
        0.02
    );


    calculatePhysics(dt);

    draw();


    requestAnimationFrame(
        animate
    );
}


// ----------------
// Nút Reset
// ----------------

document
    .getElementById("reset")
    .addEventListener(
        "click",
        reset
    );


// ----------------
// Khởi động
// ----------------

reset();

requestAnimationFrame(
    animate
);
```
