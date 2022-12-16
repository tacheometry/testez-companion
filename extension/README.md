[marketplace-shield]: https://img.shields.io/visual-studio-marketplace/d/tacheometrist.testez-companion
[marketplace-url]: https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion
[license-shield]: https://img.shields.io/github/license/tacheometry/testez-companion
[license-url]: https://github.com/tacheometry/testez-companion/blob/master/LICENSE.md

<img align="right" src="https://user-images.githubusercontent.com/39647014/116725501-a2944700-a9ea-11eb-80ce-f5699b0c6568.png"/>

# TestEZ Companion

[![License][license-shield]][license-url]
[![Visual Studio Marketplace][marketplace-shield]][marketplace-url]

Run [TestEZ](https://roblox.github.io/testez/) tests and view their results right from VS Code.

-   Install the Roblox Studio plugin with the command
-   Make a `testez-companion.toml` file to configure how TestEZ should behave:

    ```toml
    # These are the locations of your .spec files (descendants are searched too)
    roots = ["ReplicatedStorage/myTests", "ServerStorage/some/other/tests"]

    [extraOptions]
    # Optionally, an extraOptions table can be passed to TestBootstrap
    ```

-   Sync your scripts into Studio with [Rojo](https://rojo.space/)
-   Run the tests by pressing the Run button, the command, <kbd>Ctrl</kbd><kbd>;</kbd>, or by enabling the `runTestsOnSave` setting.
-   See the results!

_You can also right click on failing "it" blocks to output their errors._

To see the console logs and errors of your tests, open the Output tab in the terminal view (opened by default with <kbd>Ctrl</kbd><kbd>`</kbd>), and select TestEZ Companion's output.

![](https://user-images.githubusercontent.com/39647014/115806038-bdfdc180-a3ee-11eb-9c7c-f85b4491a8bc.png)
