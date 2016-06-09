function mainFunc() {

    var ctx = canva.getContext("2d");
    var width = canva.width;
    var height = canva.height;

    var ctx2 = canva2En.getContext("2d");
    var width2 = canva2En.width;
    var height2 = canva2En.height;

    var ctx3 = canva3En.getContext("2d");
    var width3 = canva3En.width;
    var height3 = canva3En.height;

    var particles = []; // массив частиц
    var N = 50;

    var radius = 20;
    var pDist = 2.5 * radius / 5;

    var step = 10;
    var fps = 30;

    var Pi = 3.1415926;                   // число "пи"

    var m0 = 1;                           // масштаб массы
    var T0 = 1;                           // масштаб времени (период колебаний исходной системы)
    var a0 = 1;                           // масштаб расстояния (диаметр шара)

    var k0 = 2 * Pi / T0;                 // масштаб частоты
    var C0 = m0 * k0 * k0;                // масштаб жесткости

    // *** Задание физических параметров ***

    var m = 1 * m0;                 	    // масса
    var m2 = 10 * m;
    var C = 1 * C0;
    var T = 0;
    var dt = 0.5 * T0 /fps;

    var param = [];

    var currKinEn = 0;
    var currPotEn = 0;
    var currKinEnM1 = 0;
    var currPotEnM1 = 0;
    var currKinEnM2 = 0;
    var currPotEnM2 = 0;

    New.onclick = function() {

         N = +(document.getElementById('number_input').value);
         m2 = +(document.getElementById('mass_input').value) * m;

         particles =[];
         param = [];
         createParam();
         createParticles();

         T = 0;
         ctx.clearRect(0, 0, width, height);
         ctx2.clearRect(0, 0, width2, height2);
         ctx3.clearRect(0, 0, width3, height3);

    }

    function createParam () {
        for (var i = 0; i < 2; ++i) {
            var n = [];

            n.pot = 0;
            n.kin = 0;
            n.kinM1 = 0;
            n.kinM2 = 0;
            n.potM1 = 0;
            n.potM2 = 0;

            param[i] = n;
        }
    }

    function createParticles () {
        for (var i = 1; i < N + 1; ++i) {

            var b = [] // конкретная частичка

            b.x0 = pDist*(i); //начальные координаты
            b.fu = 0;
            b.vu = (Math.random()-0.5) * 5;
            b.uu = 0; // начальное смещение
            b.kinEn = 0;
            b.potEn = 0;

            particles[i] = b; //записываем в массив
        }

        particles[0] = particles[N];
        particles[N+1] = particles[1];
    }

    //первый запуск
    createParam();
    createParticles();

    var maxKinEn = 0;
    var maxPotEn = 0;

    function launch() {

        physics();
        draw();
        draw2();
        draw3();
        RefParam();

    }

    function physics() {
        currKinEn = 0;
        currPotEn = 0;

        currKinEnM1 = 0;
        currKinEnM2 = 0;

        currPotEnM1 = 0;
        currPotEnM2 = 0;

        for (var s=1; s<=step; s++) {
            for (var i=1; i<particles.length-1; i++) {
                particles[i].fu = C*(particles[i+1].uu - 2*particles[i].uu + particles[i-1].uu);
                if (i % 2 === 0) {
                    particles[i].vu += particles[i].fu / m * dt;
                    particles[i].kinEn = m * Math.pow(particles[i].vu, 2) / 2;

                    currKinEnM1 += particles[i].kinEn;
                } else {
                    particles[i].vu += particles[i].fu / m2 * dt;
                    particles[i].kinEn = m2 * Math.pow(particles[i].vu, 2) / 2;

                    currKinEnM2 += particles[i].kinEn;
                }

                currKinEn += particles[i].kinEn;
            }

            particles[0].vu = 0;
            particles[N+1].vu = 0;

            for (var i2=1; i2 < particles.length-1; i2++ ) {
                particles[i2].uu += particles[i2].vu * dt;
                particles[i2].potEn = C * Math.pow((particles[i2].uu - particles[i2-1].uu), 2) / 2;

                currPotEn += particles[i2].potEn;

                if(i2 % 2 == 0 ) currPotEnM1 += particles[i2].potEn;
                else currPotEnM2 += particles[i2].potEn;
            }
        }

        T += dt;
        if (T > 900/200) {
            T = 0;
            ctx2.clearRect(0, 0, width2, height2);
            ctx3.clearRect(0, 0, width3, height3);
        }

        maxPotEn = param[1].pot + param[1].kin;

        param[1].pot = currPotEn;
        param[1].kin = currKinEn;

        param[1].kinM1 = currKinEnM1;
        param[1].kinM2 = currKinEnM2;

        param[1].potM1 = currPotEnM1;
        param[1].potM2 = currPotEnM2;

    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "#db2f27";
        ctx.fillText('Частица массой M1', 25, 10);

        ctx.fillStyle = "#0098d8";
        ctx.fillText('Частица массой M2', 130, 10);

        for(i = 1; i < N + 1; ++i) {
            ctx.beginPath();
            if ( i % 2 === 0) ctx.fillStyle = "#db2f27";
            else ctx.fillStyle = "#0098d8";
            ctx.arc((particles[i].x0 + particles[i].uu) * width / (N) / 10 - 5, height/2, radius * 10 / N , 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function draw2() {
        //очистка легенды
        ctx2.clearRect(0, 0, width2, 30);

        ctx2.lineWidth="3";
        ctx2.strokeStyle="#7FFFD4";
        ctx2.beginPath();

        ctx2.moveTo(10, 10);
        ctx2.lineTo(20, 10);
        ctx2.fillText('Кин энергия системы', 25, 10);

        ctx2.moveTo((T - dt) * 200 , height2  - param[0].kin / maxPotEn * (height2 - 20) );
        ctx2.lineTo(T * 200, height2 - param[1].kin / maxPotEn * (height2 - 20) );
        ctx2.stroke();

        //M1
        ctx2.lineWidth="3";
        ctx2.strokeStyle="#0098d8";
        ctx2.beginPath();

        ctx2.moveTo(180, 10);
        ctx2.lineTo(190, 10);
        ctx2.fillText('Кин энергия частиц массы M1', 195, 10);

        ctx2.moveTo((T - dt) * 200 , height2 - param[0].kinM1 / maxPotEn * (height2 - 20));
        ctx2.lineTo(T * 200, height2 - param[1].kinM1 / maxPotEn * (height2 - 20));
        ctx2.stroke();

        //M2
        ctx2.lineWidth="3";
        ctx2.strokeStyle="#f43530";
        ctx2.beginPath();

        ctx2.moveTo(390, 10);
        ctx2.lineTo(400, 10);
        ctx2.fillText('Кин энергия частиц массы M2', 405, 10);

        ctx2.moveTo((T - dt) * 200 , height2 - param[0].kinM2 / maxPotEn * (height2 - 20));
        ctx2.lineTo(T * 200, height2 - param[1].kinM2 / maxPotEn * (height2 - 20));
        ctx2.stroke();

        //ось Y
        ctx2.lineWidth="1";
        ctx2.strokeStyle="#000000";
        ctx2.beginPath();
        ctx2.moveTo(0, height2);
        ctx2.lineTo(width2, height2);
        ctx2.lineTo(width2 - 5, height2 - 10 + 5);
        ctx2.stroke();
        ctx2.font = "12px Arial";
        ctx2.fillText("t", width2 - 15, height2 - 5);
    }

    function draw3() {
        //очистка легенды
        ctx3.clearRect(0, 0, width3, 30);

        ctx3.lineWidth="3";
        ctx3.strokeStyle="#7FFFD4";
        ctx3.beginPath();

        ctx3.moveTo(10, 10);
        ctx3.lineTo(20, 10);
        ctx3.fillText('Пот энергия системы', 25, 10);

        ctx3.moveTo((T - dt) * 200 , height3  - param[0].pot / maxPotEn * (height3 - 20));
        ctx3.lineTo(T * 200, height3 - param[1].pot / maxPotEn * (height3 - 20));
        ctx3.stroke();

        //M1
        ctx3.lineWidth="3";
        ctx3.strokeStyle="#0098d8";
        ctx3.beginPath();

        ctx3.moveTo(180, 10);
        ctx3.lineTo(190, 10);
        ctx3.fillText('Пот энергия частиц массы M1', 195, 10);

        ctx3.moveTo((T - dt) * 200 , height3  - param[0].potM1 / maxPotEn * (height3 - 20));
        ctx3.lineTo(T * 200, height3 - param[1].potM1 / maxPotEn * (height3 - 20));
        ctx3.stroke();

        //M2
        ctx3.lineWidth="3";
        ctx3.strokeStyle="#f43530";
        ctx3.beginPath();

        ctx3.moveTo(390, 10);
        ctx3.lineTo(400, 10);
        ctx3.fillText('Пот энергия частиц массы M2', 405, 10);

        ctx3.moveTo((T - dt) * 200 , height3  - param[0].potM2 / maxPotEn * (height3 - 20));
        ctx3.lineTo(T * 200, height3 - param[1].potM2 / maxPotEn * (height3 - 20));
        ctx3.stroke();

        //ось Y
        ctx3.lineWidth="1";
        ctx3.strokeStyle="#000000";
        ctx3.beginPath();
        ctx3.moveTo(0, height3);
        ctx3.lineTo(width3, height3);
        ctx3.lineTo(width3 - 5, height3 - 5);
        ctx3.stroke();
        ctx3.font = "12px Arial";
        ctx3.fillText("t", width3 - 15, height3 - 5);
    }

    function RefParam () {
        param[0].kin = param[1].kin;
        param[0].kinM1 = param[1].kinM1;
        param[0].kinM2 = param[1].kinM2;

        param[0].pot = param[1].pot;
        param[0].potM1 = param[1].potM1;
        param[0].potM2 = param[1].potM2;
    }

    setInterval(launch, 1000/fps);
}
