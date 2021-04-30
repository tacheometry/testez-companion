[discord-shield]: https://img.shields.io/discord/836770519679762474.svg?logo=discord&colorB=7289DA
[discord-url]: https://discord.gg/AtpTzcp4GY
[marketplace-shield]: https://img.shields.io/visual-studio-marketplace/d/tacheometrist.testez-companion
[marketplace-url]: https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion
[license-shield]: https://img.shields.io/github/license/tacheometry/testez-companion
[license-url]: https://github.com/tacheometry/testez-companion/blob/master/LICENSE.md

<img align="right" src="https://user-images.githubusercontent.com/39647014/116725501-a2944700-a9ea-11eb-80ce-f5699b0c6568.png"/>

# TestEZ Companion

[![License][license-shield]][license-url]
[![Discord Server][discord-shield]][discord-url]
[![Visual Studio Marketplace][marketplace-shield]][marketplace-url]

Run [TestEZ](https://roblox.github.io/testez/) tests and view their results right from VS Code.

-   Install the Roblox Studio plugin with either the command or saving it, adding it to Studio and clicking `Save as Local Plugin` (`command:testez-companion.buildPlugin`)
-   Make a `testez-companion.toml` file to configure how TestEZ should behave:

    ```toml
    roots = ["ReplicatedStorage/myTests", "ServerStorage/some/other/tests"] # locations of your .spec files (which are found as descendants too)
    extraOptions = {} # optional extraOptions for TestBootstrap
    ```

-   Sync into Studio with [Rojo](https://rojo.space/)
-   Run the tests by pressing the Run button, running the command, or <kbd>Ctrl</kbd>+<kbd>;</kbd> (<kbd>⌘</kbd>+<kbd>;</kbd>)
-   See the results!

_You can also right click on failing "it" blocks to output their errors._

![](https://user-images.githubusercontent.com/39647014/115806038-bdfdc180-a3ee-11eb-9c7c-f85b4491a8bc.png)

## Known issues (contributions welcome)

-   The `testez-companion.installPlugin` command only works on `win32` systems. For installing the plugin on other systems, users will have to run `command:testez-companion.buildPlugin`, then drag the `TestEZ Companion.rbxmx` over to Studio, and click `Save as Local Plugin`.

## Contributing

-   Get [the repository](https://github.com/tacheometry/testez-companion)
-   Run `npm i`
-   Run `npm run webpack-watch`
-   Under the `Run and Debug` tab, click "Run Extension"
-   After making code changes, press "Restart" in the top menu
