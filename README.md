# TestEZ Companion

Run [TestEZ](https://roblox.github.io/testez/) tests and view their results right from VS Code.

-   Install the Roblox Studio plugin with either the command or by building it (`plugin` directory)
-   Make a `testez-companion.toml` file to configure how TestEZ should behave:

    ```toml
    	roots = ["ReplicatedStorage/myTests"] # locations of your .spec files (which are found as descendants too)
    	extraOptions = {} # optional extraOptions for TestBootstrap
    ```

    **WARNING:** Try to make your roots not contain any other instances that you do not need for testing. For example, having only "ServerStorage" as a root will probably cause some lag if you have lots of models inside ServerStorage. As a way to hot reload .spec files and preserve dependencies, roots are cloned each time tests run.

-   Sync into Studio with [Rojo](https://rojo.space/)
-   Run the tests by pressing the Run button, running the command, or <kbd>Ctrl</kbd>+<kbd>;</kbd> (<kbd>⌘</kbd>+<kbd>;</kbd>)
-   See the results!

_You can also right click on failing "it" blocks to output their errors._

![](https://user-images.githubusercontent.com/39647014/115806038-bdfdc180-a3ee-11eb-9c7c-f85b4491a8bc.png)

## Known issues (contributions welcome)

-   The `testez-inspector.installPlugin` command only works on `win32` systems. For installing the plugin on other systems, users will have to run `command:testez-inspector.buildPlugin`, then drag the `TestEZ Companion.rbxmx` over to Studio, and click `Save as Local Plugin`.

## Contributing

-   Get [the repository](https://github.com/tacheometry/testez-companion)
-   Run `npm i`
-   Run `npm run webpack-watch`
-   Under the `Run and Debug` tab, click "Run Extension"
-   After making code changes, press "Restart" in the top menu
