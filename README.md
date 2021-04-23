# TestEZ Companion

Run [TestEZ](https://roblox.github.io/testez/) tests and view their results right from VS Code.

-   Install the Roblox Studio plugin with either the command or by building it (`plugin` directory)
-   Make a `testRunner.lua` file to configure in which roots to get your `.spec` files from:
    ```lua
    return {
    	roots = { game:GetService("ReplicatedStorage") }
    	extraOptions = {...} -- optional extraOptions field for TestBootstrap
    }
    ```
    The extension will attempt to find one file of that name under `ReplicatedStorage`,`ServerScriptService`, or `StarterPlayer.StarterPlayerScripts`.
-   Write `.spec` tests
-   Sync into Studio with [Rojo](https://rojo.space/)
-   Run the tests by pressing the Run button, running the command, or <kbd>Ctrl</kbd>+<kbd>;</kbd> (<kbd>⌘</kbd>+<kbd>;</kbd>)
-   See the results!

_You can also right click on failing "it" blocks to output their errors._

![](https://user-images.githubusercontent.com/39647014/115806038-bdfdc180-a3ee-11eb-9c7c-f85b4491a8bc.png)

## Extension Settings

This extension contributes the following settings:

-   `testez-companion.runOnStartup`: Whether to start listening for TestEZ results right after the extension boots.
-   `testez-companion.port`: The port to use for receiving data from Studio.

## Known issues (contributions welcome)

-   The `testez-inspector.installPlugin` command only works on `win32` systems. For installing the plugin on other systems, users will have to run `command:testez-inspector.buildPlugin`, then drag the `TestEZ Companion.rbxmx` over to Studio, and click `Save as Local Plugin`.

## Contributing

-   Get the repository
-   Run `npm i`
-   Run `npm run webpack-watch`
-   Under the `Run and Debug` tab, click "Run Extension"
-   After making code changes, press "Restart" in the top menu
