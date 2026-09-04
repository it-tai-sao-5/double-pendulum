const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

const gravity = 9.81;

const length1 = 120;
const length2 = 120;

const mass1 = 1;
const mass2 = 1;

// Tốc độ mô phỏng
const SIMULATION_SPEED = 4;

// Hai con lắc kép
const pendulums = [
    {
        angle1: 120 * Math.PI / 180,
        angle2: 60 * Math.PI / 180,
        velocity1: 0,
        velocity2: 0,
        trail: [],
        color: "#ff4444"
    },

    {
        angle1: 120 * Math.PI / 180 + 0.000001,
        angle2: 60 * Math.PI / 180,
        velocity1: 0,
        velocity2: 0,
        trail: [],
        color: "#44aaff"
    }
];

const MAX_TRAIL = 1000;


// ================================
// Reset
// ================================

function reset() {
    const a1 = Number(document.getElementById("angle1").value);
    const a2 = Number(document.getElementById("angle2").value);

    pendulums[0].angle1 = a1 * Math.PI / 180;
    pendulums[0].angle2 = a2 * Math.PI / 180;

    pendulums[1].angle1 = (a1 + 0.000001) * Math.PI / 180;
    pendulums[1].angle2 = a2 * Math.PI / 180;

    for (const p of pendulums) {
        p.velocity1 = 0;
        p.velocity2 = 0;
        p.trail.length = 0;
    }
}


// ================================
// Vật lý
// ================================

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
            Math.sin(difference)
            *
            (
                p.velocity1 * p.velocity1 *
                length1 *
                (mass1 + mass2)

                + gravity *
                (mass1 + mass2) *
                Math.cos(p.angle1)

                + p.velocity2 * p.velocity2 *
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


// ================================
// Vẽ quả
// ================================

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}


// ================================
// Vẽ một con lắc kép
// ================================

function drawPendulum(p, originX, originY) {
    const x1 =
        originX +
        length1 *
        Math.sin(p.angle1);

    const y1 =
        originY +
        length1 *
        Math.cos(p.angle1);


    const x2 =
        x1 +
        length2 *
        Math.sin(p.angle2);

    const y2 =
        y1 +
        length2 *
        Math.cos(p.angle2);


    // Quỹ đạo
    p.trail.push({
        x: x2,
        y: y2
    });

    if (p.trail.length > MAX_TRAIL) {
        p.trail.shift();
    }


    ctx.beginPath();

    for (let i = 0; i < p.trail.length; i++) {
        const point = p.trail[i];

        if (i === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    }

    ctx.strokeStyle = p.color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.globalAlpha = 1;


    // Hai thanh
    ctx.beginPath();

    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = p.color;
    ctx.lineWidth = 5;
    ctx.stroke();


    // Điểm treo
    drawCircle(
        originX,
        originY,
        7,
        "#ffffff"
    );


    // Quả 1
    drawCircle(
        x1,
        y1,
        15,
        p.color
    );


    // Quả 2
    drawCircle(
        x2,
        y2,
        19,
        p.color
    );
}


// ================================
// Vẽ toàn bộ
// ================================

function draw() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Con lắc đỏ
    drawPendulum(
        pendulums[0],
        280,
        100
    );


    // Con lắc xanh
    drawPendulum(
        pendulums[1],
        720,
        100
    );


    // Chữ
    ctx.font = "20px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.fillText(
        "Con lắc A",
        280,
        40
    );

    ctx.fillText(
        "Con lắc B",
        720,
        40
    );
}


// ================================
// Animation
// ================================

let lastTime = performance.now();

function animate(currentTime) {
    let dt =
        (currentTime - lastTime) / 1000;

    lastTime = currentTime;

    dt = Math.min(dt, 0.02);

    // Chạy nhanh hơn
    dt *= SIMULATION_SPEED;


    // Chia nhỏ bước để vật lý ổn định
    const substeps = 4;
    const subDt = dt / substeps;

    for (let i = 0; i < substeps; i++) {
        for (const p of pendulums) {
            calculatePhysics(p, subDt);
        }
    }


    draw();

    requestAnimationFrame(animate);
}


// ================================
// Nút Reset
// ================================

document
    .getElementById("reset")
    .addEventListener(
        "click",
        reset
    );


// ================================
// Khởi động
// ================================

reset();
draw();

requestAnimationFrame(animate);
