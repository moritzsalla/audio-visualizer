const playButton = document.querySelector(".button-wrapper")
let maxi = maximilian();
let maxiEngine = new maxi.maxiAudio();
let osc1 = new maxi.maxiOsc();
let osc2 = new maxi.maxiOsc();
let osc3 = new maxi.maxiOsc();
let drawOutput = 0;
let audioOut;

let playAudio = () => {
  playButton.removeEventListener("click", playAudio)
  playButton.classList.add("hide")
  maxiEngine.init();

  maxiEngine.play = () => {
    audioOut = ((osc1.sinewave(120) * 2) * osc3.sinewave(0.5)) * osc2.sinewave(0.2)
    return audioOut
  }

  // CANVAS -------------------------------------

  let fov = 500;
  let canvas = document.querySelector("canvas");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let context = canvas.getContext("2d");

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  let point = [];
  let points = [];
  let point3d = [];
  let angleX = 0;
  let angleY = 0;
  let HALF_WIDTH = width / 2;
  let HALF_HEIGHT = height / 2;
  let x3d = 0;
  let y3d = 0;
  let z3d = 0;
  let lastScale = 0;
  let lastx2d = 0;
  let lasty2d = 0;
  let dim = 50;
  let spacing = ((Math.PI * 2) / dim);
  let numPoints = dim * dim;
  let size = 250;

  for (let i = 0; i < dim; i++) {
    let z = size * Math.cos(spacing / 2 * i);
    let s = size * Math.sin(spacing / 2 * i);

    for (let j = 0; j < dim; j++) {
      let point = [Math.cos(spacing * j) * s, Math.sin(spacing * j) * s, z];
      points.push(point);
    }
  }

  function draw() {
    // fetch audio in
    let audioIn = audioOut * 10 || 0

    if (audioIn === null || audioIn === undefined) {
      audioIn = 0
    }

    fov = 500 + audioIn
    console.log(audioIn)

    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, width, height);
    angleX = 0.0001 + (audioIn * 0.00055);
    angleY = 0.0001 + (audioIn * 0.00055);

    for (let i = 0; i < numPoints; i++) {
      point3d = points[i];
      z3d = point3d[2];

      if (z3d < -fov) z3d += 0;
      point3d[2] = z3d;
      rotateX(point3d, angleX);
      rotateY(point3d, angleY);
      x3d = point3d[0];
      y3d = point3d[1];
      z3d = point3d[2];

      let scale = (fov / (fov + z3d));
      let x2d = (x3d * scale) + HALF_WIDTH;
      let y2d = (y3d * scale) + HALF_HEIGHT;

      context.lineWidth = 1;
      context.strokeStyle = "rgb(255,255,255)";
      context.beginPath();
      context.moveTo(x2d, y2d);
      context.lineTo(x2d + scale, y2d);
      context.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  function rotateX(point3d, angleX) {
    let x = point3d[0];
    let z = point3d[2];
    let cosRY = Math.cos(angleX);
    let sinRY = Math.sin(angleX);
    let tempz = z;
    let tempx = x;

    x = (tempx * cosRY) + (tempz * sinRY);
    z = (tempx * -sinRY) + (tempz * cosRY);

    point3d[0] = x;
    point3d[2] = z;
  }

  function rotateY(point3d, angleY) {
    let y = point3d[1];
    let z = point3d[2];
    let cosRX = Math.cos(angleY);
    let sinRX = Math.sin(angleY);
    let tempz = z;
    let tempy = y;

    y = (tempy * cosRX) + (tempz * sinRX);
    z = (tempy * -sinRX) + (tempz * cosRX);

    point3d[1] = y;
    point3d[2] = z;
  }
}

playButton.addEventListener("click", playAudio)