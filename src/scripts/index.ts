let useBgImage = false;
let bgImageSrc = "";

const bgImage = new Image();
bgImage.onload = () => {
  body.style.setProperty("--bg-image", `url(${bgImageSrc})`);
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
        foregroundColor = root.style.getPropertyValue("--color-foreground");
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
      case "bgSizing":
        body.style.setProperty("--bg-size", bgSizes[val]);
        break;

      case "bgPositioning":
        body.style.setProperty("--bg-position", bgPositions[val]);
        break;

      case "amplitude":
        verticalDotCount = val;
        break;

      case "dotScale":
        dotScale = val * 0.5;
        calcDotSize();
        break;

      case "dotCount":
        numDots = val;
        calcDotSize();
        break;

      case "sortingMode":
        switch (val) {
          case 0:
            arraySortStrat = concentratedSort;
            break;
          default:
            arraySortStrat = noSort;
            break;
        }
        break;
    }
}
