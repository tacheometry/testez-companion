## 2.0.0

-   Rewrite of the extension/plugin.
-   Studio console logs are now sent to the `Output` tab in VS Code. Test errors are printed here too.
-   The HTTP server to communicate with Studio (`http://localhost:28859`) is now only open while running tests - previously it was open for the entire duration of the extension being active.
-   The `testez-companion.toml` file's contents are now validated.
-   The Studio plugin no longer errors when running the game.
-

## 1.1.2

-   Better hot reloading. Roots aren't cloned anymore.
-   Fixes the issue where using modules outside of roots does not hot reload them.

## 1.1.0

-   Out with `testRunner.lua`, in with `testez-companion.toml`
-   Raised JSON decoding limit to 10MB (previously 100kb)
-   (Real) communication between the server and plugins, allowing for multi-place support and QoL improvements:
    -   You can now pick which place you want to run tests in! Either the first time when running tests, or by running `testez-companion.pickPlace`;
    -   The extension notifies you when a place you were listening to gets disconnected, and when there aren't any places to run tests from;
    -   There's now a progress bar when running tests.
-   Better `testez-companion.installPlugin` experience for non-Windows users

## 1.0.2

-   Fix when Studio is minimized (thanks to LastTalon)

## 1.0.1

-   Update README
-   Better extension activation events

## 1.0.0

-   Initial release
