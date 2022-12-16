[marketplace-shield]: https://img.shields.io/visual-studio-marketplace/d/tacheometrist.testez-companion
[marketplace-url]: https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion
[license-shield]: https://img.shields.io/github/license/tacheometry/testez-companion
[license-url]: https://github.com/tacheometry/testez-companion/blob/master/LICENSE.md

<img align="right" src="https://user-images.githubusercontent.com/39647014/116725501-a2944700-a9ea-11eb-80ce-f5699b0c6568.png"/>

# TestEZ Companion

[![License][license-shield]][license-url]
[![Visual Studio Marketplace][marketplace-shield]][marketplace-url]

TestEZ Companion is a Visual Studio Code extension that enables Roblox developers to preview their [TestEZ](https://roblox.github.io/testez/) test results inside VS Code.
![](https://user-images.githubusercontent.com/39647014/115806038-bdfdc180-a3ee-11eb-9c7c-f85b4491a8bc.png)

# Contributing

## VS Code extension

### Set up

After getting the repository, run `npm i` to install all dependencies.

### Running tests

Before compiling, running tests is highly encouraged. This is done through [Jasmine](https://jasmine.github.io).

- To run tests once, run: `npm test`
- To run tests in watch mode, run: `npm run test:watch`

### Compiling

The VS Code extension uses [TypeScript](https://www.typescriptlang.org), and is then bundled with [webpack](https://webpack.js.org).

- To compile once (in production mode), run: `npm run build`
- To compile in watch mode, run `npm run watch`

## Roblox Studio plugin

Make sure to first initialize git submodules:

```
git submodule init
git submodule update
```

### Installing the plugin

These commands are to be run inside the `plugin` directory of the repository.

#### By building it with Rojo

1. Run `rojo build`, and move the output file to your Studio plugins directory.
   ```
   rojo build -o "TestEZ Companion.rbxmx"
   ```

On Windows, the location of Studio plugins is `%LOCALAPPDATA%\Roblox\Plugins`.

On macOS, the location of Studio plugins is `~/Documents/Roblox/Plugins`.

#### By copying from Studio

1. Serve the `testing.project.json` file:
   ```
   rojo serve testing.project.json
   ```
2. Under `ReplicatedStorage`, right click the `TestEZ Companion` folder, and select `Save as Local Plugin...`. Selecting `Save to File...`, and saving the `rbxm*` model in your plugin directory also works.

## Test place

A basic place to test the functionality of spec files is https://github.com/tacheometry/testez-basic-place.
