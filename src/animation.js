const rainbowColors = [
  "#bc626b",
  "#cf876f",
  "#eacb8a",
  "#a3bd8d",
  "#88c0cf",
  "#b38ead",
];

const TAU = Math.PI * 2;

let canvas = document.getElementById("canvas");
let max_height, startPos, vizWidth, midY;

let numDots = 128;
let dotSize = 10;
let twiceDotSize = dotSize * 2;
let dotScale = 1;
let backgroundColor = "rgb(0,0,0)";
let foregroundColor = "rgb(255,255,255)";
let rainbow = false;
let useBgImage = false;
let bgImageSrc = "";

let ctx = canvas.getContext("2d");
let bgImageLoaded = false;
let verticalScale = 10;
let arraySortStrat = null;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const bgImage = new Image();
bgImage.onload = () => {
  bgImageLoaded = true;
  document.body.style.backgroundImage = `url(${bgImageSrc})`;
};

function calcDotSize() {
  dotSize = dotScale * (canvas.width / numDots);
  twiceDotSize = dotSize * 2;
}

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  max_height = window.innerHeight * 0.5;
  startPos = 0;
  vizWidth = window.innerWidth;
  midY = canvas.height - canvas.height * 0.5;
  calcDotSize();
}

window.onload = setCanvasSize;
window.onresize = setCanvasSize;

function livelyPropertyListener(name, val) {
  switch (name) {
    case "foregroundColor":
      var color = hexToRgb(val);
      foregroundColor = `rgb(${color.r},${color.g},${color.b})`;
      break;
    case "backgroundColor":
      var color = hexToRgb(val);
      backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
      document.body.style.backgroundColor = backgroundColor;
      break;
    case "rainbow":
      rainbow = val;
      break;
    case "useBgImage":
      useBgImage = val;
      setBgImage(useBgImage);
      break;
    case "bgImageSrc":
      bgImageSrc = val.replace("\\", "/");
      setBgImage(useBgImage);
      break;
    case "verticalScale":
      verticalScale = val;
      break;
    case "dotScale":
      dotScale = val;
      calcDotSize();
      break;
    case "bgSizing":
      switch (val) {
        case 0:
          document.body.style.backgroundSize = "cover";
          break;
        case 1:
          document.body.style.backgroundSize = "contain";
          break;
        case 2:
          document.body.style.backgroundSize = "auto";
          break;
      }
      break;
    case "bgPositioning":
      switch (val) {
        case 0:
          document.body.style.backgroundPosition = "top";
          break;
        case 1:
          document.body.style.backgroundPosition = "top left";
          break;
        case 2:
          document.body.style.backgroundPosition = "top right";
          break;
        case 3:
          document.body.style.backgroundPosition = "center";
          break;
        case 4:
          document.body.style.backgroundPosition = "center left";
          break;
        case 5:
          document.body.style.backgroundPosition = "center right";
          break;
        case 6:
          document.body.style.backgroundPosition = "bottom";
          break;
        case 7:
          document.body.style.backgroundPosition = "bottom left";
          break;
        case 8:
          document.body.style.backgroundPosition = "bottom right";
          break;
      }
      break;
    case "sortingMode":
      switch (val) {
        case 0:
          arraySortStrat = concentratedSort;
          numDots = 128;
          break;
        case 1:
          arraySortStrat = centeredSort;
          numDots = 256;
          break;
        default:
          arraySortStrat = null;
          numDots = 256;
          break;
      }
      calcDotSize();
      break;
  }
}

function concentratedSort(audioArray) {
  audioArray.sort().splice(0, audioArray.length * 0.75);
  audioArray.push(...[...audioArray].reverse());
  return audioArray;
}

function centeredSort(audioArray) {
  const newHalf = audioArray.splice(0, audioArray.length * 0.5);
  audioArray.reverse().push(...newHalf);
  return audioArray;
}

function setBgImage(useImg) {
  bgImageLoaded = false;

  if (useImg) bgImage.src = bgImageSrc;
  else {
    bgImage.src = null;
    document.body.style.backgroundImage = null;
  }
}

function renderAnim(audioArray, length) {
  ctx.fillStyle = foregroundColor;

  for (let x = 0; x < length; x++) {
    const soundVal = audioArray[x];
    const xPos = (x / length) * canvas.width;

    if (rainbow)
      ctx.fillStyle =
        rainbowColors[x % rainbowColors.length] || foregroundColor;

    for (let y = 0; y < soundVal * verticalScale; y++) {
      const vertIndex = soundVal - y / verticalScale;
      const yPos = y * twiceDotSize;
      const arcRadius = Math.min(vertIndex * dotSize, dotSize);

      ctx.beginPath();
      ctx.arc(xPos, midY - yPos, arcRadius, 0, TAU);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(xPos, midY + yPos, arcRadius, 0, TAU);
      ctx.fill();
    }
  }
}

function audioListener(audioArray) {
  if (arraySortStrat) audioArray = arraySortStrat(audioArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { length } = audioArray;
  if (length) renderAnim(audioArray, length);
}
