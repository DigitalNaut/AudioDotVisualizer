let verticalScale = 10;
let rainbow = false;
let dotSize = 10;
let twiceDotSize = dotSize * 2;
let midY = canvas.height - canvas.height * 0.5;
let arraySortStrat: AudioArraySortStrat | null = null;

function calcDotSize() {
  dotSize = dotScale * (canvas.width / numDots);
  twiceDotSize = dotSize * 2;
}

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  midY = canvas.height - canvas.height * 0.5;
  calcDotSize();
}

window.onload = setCanvasSize;
window.onresize = setCanvasSize;

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
