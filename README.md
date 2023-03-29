# Audio Dot Visualizer

![Preview](src/preview.gif)

A wallpaper plugin for [Lively Wallpaper](https://rocksdanister.github.io/lively/) for Windows. Displays the computer's audio as a spectrum of dots.

## Installation

1. Download the latest version of the Audio Dot from the [releases page](https://github.com/DigitalNaut/AudioDotVisualizer/releases/tag/Release).
2. Drag the `.zip` file into Lively.
3. Set the `Audio Dot` wallpaper with a click.
4. Play music and enjoy!

You can customize the appearance via the right-click on the Lively UI.

## Developers

### Prerequisites

#### Required

- [Node.js](https://nodejs.org/en/) (v18.15.0 LTS) (Restart computer after install)
- [Lively Wallpaper](https://rocksdanister.github.io/lively/)
- [7zip](https://www.7-zip.org/)

#### Recommended

- [Visual Studio Code](https://code.visualstudio.com/)
- [PNPM](https://pnpm.io/) or [Yarn](https://yarnpkg.com/)

### Setup (via terminal)

#### Clone the repository

```bash
git clone https://github.com/DigitalNaut/AudioDotVisualizer.git && cd AudioDotVisualizer && git checkout main && git pull origin main
```

#### Install dependencies

```bash
npm install # OR pnpm install OR yarn install
```

#### Open the project in Visual Studio Code

```bash
code .
```

### Build

I've provided a script that will build the project from TypeScript into JavaScript and package it into a `.zip` file in the `/dist` folder using [7zip](https://www.7-zip.org/). Note that it'll also [minifiy](<https://en.wikipedia.org/wiki/Minification_(programming)#Example>) the JavaScript code.

```bash
npm run build # OR pnpm build OR yarn build
```

I've also added two more scripts:

One to check the TypeScript code for type errors.

```bash
npm run typecheck # OR pnpm typecheck OR yarn typecheck
```

And another to delete the generated files in the `/dist` and `/build` folders.

```bash
npm run purge # OR pnpm purge OR yarn purge
```

### Run

Unfortunately, Lively I haven't figured out how to run the project directly from the source code. So, you'll have to build the project first and import it.

1. Open Lively Wallpaper.
2. Open the `/dist` folder.
3. Drag the `AudioDot_vX.X.X.zip` file into Lively Wallpaper.
4. Set the `Audio Dot` wallpaper.
