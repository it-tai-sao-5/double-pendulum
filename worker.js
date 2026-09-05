```js
const gravity = 9.81;

const mass1 = 1;
const mass2 = 1;

const length1 = 150;
const length2 = 150;

const SIMULATION_SPEED = 4;

// Số bước tính vật lý mỗi lần cập nhật
const SUB_STEPS = 4;

// Tần số mô phỏng nền
const TICK_RATE = 60;

const pendulum1 = {
    angle1: 0,
    angle2: 0,

    velocity1: 0,
    velocity2: 0
};


const pendulum2 = {
    angle1: 0,
    angle2: 0,

    velocity1: 0,
    velocity2: 0
};


let running = false;


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

            -

            mass2 *
            gravity *
            Math.sin(
                p.angle1 -
                2 * p.angle2
            )

            -

            2 *
            Math.sin(difference) *
            mass2 *
            (
                p.velocity2 *
                p.velocity2 *
                length2

                +

                p.velocity1 *
                p.velocity1 *
                length1 *
                Math.cos(difference)
            )

        )
        /
        (
            length1 *
            denominator
        );


    const acceleration2 =
        (
            2 *
            Math.sin(difference)
            *
            (
                p.velocity1 *
                p.velocity1 *
                length1 *
                (mass1 + mass2)

                +

                gravity *
                (mass1 + mass2) *
                Math.cos(p.angle1)

                +

                p.velocity2 *
                p.velocity2 *
                length2 *
                mass2 *
                Math.cos(difference)
            )
        )
        /
        (
            length2 *
            denominator
        );


    p.velocity1 +=
        acceleration1 * dt;

    p.velocity2 +=
        acceleration2 * dt;


    p.angle1 +=
        p.velocity1 * dt;

    p.angle2 +=
        p.velocity2 * dt;
}


function update() {

    const dt =
        (
            1 / TICK_RATE
        ) *
        SIMULATION_SPEED;


    const step =
        dt / SUB_STEPS;


    for (
        let i = 0;
        i < SUB_STEPS;
        i++
    ) {

        calculatePhysics(
            pendulum1,
            step
        );

        calculatePhysics(
            pendulum2,
            step
        );
    }


    postMessage({

        type: "state",

        pendulum1: {
            angle1: pendulum1.angle1,
            angle2: pendulum1.angle2
        },

        pendulum2: {
            angle1: pendulum2.angle1,
            angle2: pendulum2.angle2
        }

    });
}


function loop() {

    if (!running) {
        return;
    }


    update();


    setTimeout(
        loop,
        1000 / TICK_RATE
    );
}


self.onmessage = function(event) {

    const data = event.data;


    if (data.type === "reset") {

        pendulum1.angle1 =
            data.pendulum1.angle1;

        pendulum1.angle2 =
            data.pendulum1.angle2;


        pendulum2.angle1 =
            data.pendulum2.angle1;

        pendulum2.angle2 =
            data.pendulum2.angle2;


        pendulum1.velocity1 = 0;
        pendulum1.velocity2 = 0;

        pendulum2.velocity1 = 0;
        pendulum2.velocity2 = 0;


        postMessage({

            type: "state",

            pendulum1: {
                angle1: pendulum1.angle1,
                angle2: pendulum1.angle2
            },

            pendulum2: {
                angle1: pendulum2.angle1,
                angle2: pendulum2.angle2
            }

        });


        if (!running) {

            running = true;

            loop();
        }
    }
};
```
