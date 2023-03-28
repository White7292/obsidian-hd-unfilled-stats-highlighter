# Unfilled Stats Highlighter

The Unfilled Stats Highlighter is a practical [Obsidian](https://obsidian.md) plugin designed to streamline your stat/habit tracking process by automatically identifying and prefixing unfilled stats, making them easier to spot and fill out. This plugin is perfect for users who frequently work with templates and require a quick and easy way to locate and complete missing information.

This project uses Typescript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

**Note:** The Obsidian API is still in early alpha and is subject to change at any time!

# License

MIT

# Features

-   **Automatic Prefixing**: The plugin scans your notes for unfilled stats and prefixes them with a customizable marker, making it easier to locate and complete the missing information.
-   **Customizable Markers**: Choose your preferred prefix for unfilled stats, such as an emoji, special character, or text, to draw attention to the areas that require completion.
-   **Real-time Updates**: As you fill out the missing information, the plugin automatically removes the prefix, keeping your notes clean and up-to-date.
-   **Configurable**: The Unfilled Stats Highlighter plugin seamlessly integrates with Obsidian, allowing you to easily configure the highlighter to only target your stat files.

## Adding your plugin to the community plugin list

-   Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
-   Publish an initial version.
-   Make sure you have a `README.md` file in the root of your repo.
-   Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

-   Clone this repo.
-   `npm i` or `yarn` to install dependencies
-   `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

-   Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)

-   [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
-   To use eslint with this project, make sure to install eslint from terminal:
    -   `npm install -g eslint`
-   To use eslint to analyze this project use this command:
    -   `eslint main.ts`
    -   eslint will then create a report with suggestions for code improvement by file and line number.
-   If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
    -   `eslint .\src\`

## API Documentation

See https://github.com/obsidianmd/obsidian-api
