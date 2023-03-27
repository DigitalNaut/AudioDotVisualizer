const { body, documentElement: root } = document;
const bg = <HTMLDivElement>document.getElementById("bg");
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let max_height: number, startPos: number, vizWidth: number, midY: number;
let numDots = 128;
let dotSize = 10;
let twiceDotSize = dotSize * 2;
let dotScale = 1;
let rainbow = false;
let useBgImage = false;
let bgImageSrc = "";
let verticalScale = 10;
let arraySortStrat: AudioArraySortStrat | null = null;

function hexToRgb(hex: string) {
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
  body.style.setProperty("--bg-image", `url(${bgImageSrc})`);
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

function livelyPropertyListener(name: string, val: string | boolean | number) {
  if (typeof val === "string") {
    switch (name) {
      case "bgImageSrc":
        bgImageSrc = val.replace("\\", "/");
        setBgImage(useBgImage);
        break;

      case "foregroundColor":
        var color = hexToRgb(val);
        root.style.setProperty(
          "--color-foreground",
          `rgb(${color?.r},${color?.g},${color?.b})`
        );
        break;

      case "backgroundColor":
        var color = hexToRgb(val);
        root.style.setProperty(
          "--color-background",
          `rgb(${color?.r},${color?.g},${color?.b})`
        );
        break;
    }
  }

  if (typeof val === "boolean") {
    switch (name) {
      case "rainbow":
        rainbow = val;
        break;

      case "useBgImage":
        useBgImage = val;
        setBgImage(useBgImage);
        break;
    }
  }

  if (typeof val === "number")
    switch (name) {
      case "verticalScale":
        verticalScale = val;
        break;

      case "dotScale":
        dotScale = val;
        calcDotSize();
        break;

      case "bgSizing":
        body.style.setProperty("--bg-size", bgSizes[val]);
        break;

      case "bgPositioning":
        body.style.setProperty("--bg-position", bgPositions[val]);
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

const concentratedSort: AudioArraySortStrat = (audioArray) => {
  audioArray.sort().splice(0, audioArray.length * 0.75);
  audioArray.push(...[...audioArray].reverse());
  return audioArray;
};

const centeredSort: AudioArraySortStrat = (audioArray) => {
  const newHalf = audioArray.splice(0, audioArray.length * 0.5);
  audioArray.reverse().push(...newHalf);
  return audioArray;
};

function setBgImage(useImg: boolean) {
  if (useImg) {
    bg.style.backgroundColor = "unset";
    bg.style.backgroundImage = "unset";
    bgImage.src = bgImageSrc;
    body.style.backgroundImage = "var(--bg-image)";
  } else {
    bg.style.backgroundColor = "var(--color-background)";
    bg.style.backgroundImage = "var(--bg-gradient)";
    bgImage.src = "";
    body.style.backgroundImage = "unset";
  }
}

function renderAnim(audioArray: AudioArray) {
  if (!ctx) return;

  const foregroundColor = root.style.getPropertyValue("--color-foreground");
  ctx.fillStyle = foregroundColor;

  for (let x = 0; x < audioArray.length; x++) {
    const soundVal = audioArray[x];
    const xPos = (x / audioArray.length) * canvas.width;

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

function livelyAudioListener(audioArray: AudioArray) {
  if (arraySortStrat) audioArray = arraySortStrat(audioArray);

  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  renderAnim(audioArray);
}
