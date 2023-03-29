const { body, documentElement: root } = document;
const bg = <HTMLDivElement>document.getElementById("bg");
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// User preferences
let dotScale = 0.5;
let verticalDotCount = 25;
let numDots = 128;
let adjustedNumDots = 0;
let rainbow = false;

const concentratedSort: AudioArraySortStrat = (audioArray) => {
  const slice = audioArray.sort((a, b) => a - b).slice(adjustedNumDots);
  return [...slice, ...slice.reverse()];
};

const centerSplitSort: AudioArraySortStrat = (audioArray) => {
  const slice = audioArray.sort((a, b) => b - a).slice(0, adjustedNumDots);
  return [...slice, ...slice.reverse()];
};

const reverseWaveSort: AudioArraySortStrat = (audioArray) =>
  audioArray.slice(0, numDots).reverse();

const noSort: AudioArraySortStrat = (audioArray) =>
  audioArray.slice(0, numDots);

// Dynamic properties
let arraySortStrat = noSort;
let foregroundColor = root.style.getPropertyValue("--color-foreground");
let dotRadius: number,
  dotDiameter: number,
  maxVerticalDotCount: number,
  midY: number;

function calcDotSize() {
  dotRadius = dotScale * (canvas.width / numDots);
  dotDiameter = dotRadius * 2;
  maxVerticalDotCount = Math.ceil((canvas.height / dotDiameter) * 0.5);
  adjustedNumDots = 128 - numDots * 0.5;
}

function calcCanvasProps() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  midY = canvas.height - canvas.height * 0.5;
  calcDotSize();
}

window.onload = calcCanvasProps;
window.onresize = calcCanvasProps;

function renderAnim(audioArray: AudioArray) {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = foregroundColor;

  for (let x = 0; x < audioArray.length; x++) {
    let soundVal = audioArray[x];
    if (soundVal > 1) soundVal = 1;

    const xPos = (x / audioArray.length) * canvas.width;

    if (rainbow) ctx.fillStyle = rainbowColors[x % rainbowColors.length];

    let yLimit = soundVal * verticalDotCount;
    if (yLimit > maxVerticalDotCount) yLimit = maxVerticalDotCount;

    for (let y = 0; y < yLimit; y++) {
      const vertIndex = soundVal - y / verticalDotCount;
      const yPos = y * dotDiameter;
      let radius = dotRadius * vertIndex;

      ctx.beginPath();
      ctx.arc(xPos, midY - yPos, radius, 0, TAU);
      ctx.arc(xPos, midY + yPos, radius, 0, TAU);
      ctx.fill();
    }
  }
}

function livelyAudioListener(audioArray: AudioArray) {
  renderAnim(arraySortStrat(audioArray));
}
