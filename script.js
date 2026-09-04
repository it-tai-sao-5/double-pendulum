const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const gravity = 9.81;

const mass1 = 1;
const mass2 = 1;

const length1 = 150;
const length2 = 150;

// Tăng tốc mô phỏng
const SIMULATION_SPEED = 4;

// Hai con lắc
const pendulum1 = {
    angle1: 0,
    angle2: 0,
    velocity1: 0,
    velocity2: 0,
    trail: []
};

const pendulum2 = {
    angle1: 0,
    angle2: 0,
    velocity1: 0,
    velocity2: 0,
    trail: []
};

const MAX_TRAIL = 3000;


// =========================
// RESET
// =========================

function reset() {

    pendulum1.angle1 =
        Number(document.getElementById("angle1a").value)
        * Math.PI / 180;

    pendulum1.angle2 =
        Number(document.getElementById("angle2a").value)
        * Math.PI / 180;

    pendulum2.angle1 =
        Number(document.getElementById("angle1b").value)
        * Math.PI / 180;

    pendulum2.angle2 =
        Number(document.getElementById("angle2b").value)
        * Math.PI / 180;

    pendulum1.velocity1 = 0;
    pendulum1.velocity2 = 0;

    pendulum2.velocity1 = 0;
    pendulum2.velocity2 = 0;

    pendulum1.trail.length = 0;
    pendulum2.trail.length = 0;
}


// =========================
// PHYSICS
// =========================

function calculatePhysics(p, dt) {

    const difference = p.angle1 - p.angle2;

    const denominator =
        2 * mass1 +
        mass2 -
        mass2 * Math.cos(2 * difference);

    const acceleration1 =
        (
            -gravity *
            (2 * mass1 + mass2) *
            Math.sin(p.angle1)

            - mass2 *
            gravity *
            Math.sin(p.angle1 - 2 * p.angle2)

            - 2 *
            Math.sin(difference) *
            mass2 *
            (
                p.velocity2 * p.velocity2 * length2
                +
                p.velocity1 * p.velocity1 *
                length1 *
                Math.cos(difference)
            )
        )
        /
        (length1 * denominator);


    const acceleration2 =
        (
            2 *
            Math.sin(difference) *
            (
                p.velocity1 * p.velocity1 *
                length1 *
                (mass1 + mass2)

                +
                gravity *
                (mass1 + mass2) *
                Math.cos(p.angle1)

                +
                p.velocity2 * p.velocity2 *
                length2 *
                mass2 *
                Math.cos(difference)
            )
        )
        /
        (length2 * denominator);


    p.velocity1 += acceleration1 * dt;
    p.velocity2 += acceleration2 * dt;

    p.angle1 += p.velocity1 * dt;
    p.angle2 += p.velocity2 * dt;
}


// =========================
// DRAW ONE PENDULUM
// =========================

function drawPendulum(p, color) {

    const originX = canvas.width / 2;
    const originY = 100;

    const x1 =
        originX +
        length1 * Math.sin(p.angle1);

    const y1 =
        originY +
        length1 * Math.cos(p.angle1);

    const x2 =
        x1 +
        length2 * Math.sin(p.angle2);

    const y2 =
        y1 +
        length2 * Math.cos(p.angle2);


    // Trail
    p.trail.push({
        x: x2,
        y: y2
    });

    if (p.trail.length > MAX_TRAIL) {
        p.trail.shift();
    }


    // Vẽ trail
    ctx.beginPath();

    for (let i = 0; i < p.trail.length; i++) {

        if (i === 0) {
            ctx.moveTo(
                p.trail[i].x,
                p.trail[i].y
            );
        } else {
            ctx.lineTo(
                p.trail[i].x,
                p.trail[i].y
            );
        }
    }

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.globalAlpha = 1;


    // Hai thanh
    ctx.beginPath();

    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();


    // Điểm treo
    ctx.beginPath();
    ctx.arc(
        originX,
        originY,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();


    // Quả 1
    ctx.beginPath();
    ctx.arc(
        x1,
        y1,
        15,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();


    // Quả 2
    ctx.beginPath();
    ctx.arc(
        x2,
        y2,
        20,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();
}


// =========================
// DRAW
// =========================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Vẽ con lắc 1 trước
    drawPendulum(
        pendulum1,
        "#ff4444"
    );

    // Con lắc 2 đè chính xác lên nó
    drawPendulum(
        pendulum2,
        "#44aaff"
    );
}


// =========================
// ANIMATION
// =========================

let lastTime = performance.now();

function animate(currentTime) {

    let dt =
        (currentTime - lastTime) / 1000;

    lastTime = currentTime;

    dt = Math.min(dt, 0.02);

    // Chia thành nhiều bước nhỏ để vật lý ổn định
    const subSteps = 4;
    const step =
        (dt * SIMULATION_SPEED) / subSteps;

    for (let i = 0; i < subSteps; i++) {

        calculatePhysics(
            pendulum1,
            step
        );

        calculatePhysics(
            pendulum2,
            step
        );
    }

    draw();

    requestAnimationFrame(animate);
}


// =========================
// BUTTON
// =========================

document
    .getElementById("reset")
    .addEventListener("click", reset);


// =========================
// START
// =========================

reset();
draw();
requestAnimationFrame(animate);
