import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";

// Remember to rename these classes and interfaces!

interface EmptyStatsHighlighterSettings {
	unfilledStatPrefix: string;
	templatesDirectory: string;
}

const DEFAULT_SETTINGS: EmptyStatsHighlighterSettings = {
	unfilledStatPrefix: "==",
	templatesDirectory: "Templates",
};

export default class EmptyStatsHighlighter extends Plugin {
	settings: EmptyStatsHighlighterSettings;

	// Runs whenever the user starts using the plugin in Obsidian.
	// This is where you'll configure most of the plugin's capabilities.
	// This function is also called when the plugin is updated.
	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			// console.log("click", evt);

			const activeFile = this.app.workspace.getActiveFile();

			if (
				!activeFile?.path.contains(
					`${this.settings.templatesDirectory}/`
				)
			) {
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);

				// Make sure the user is editing a Markdown file.
				if (view) {
					const editor = view.editor;
					if (editor) {
						for (let i = 0; i < editor.lineCount(); i++) {
							const line = editor.getLine(i);

							if (
								!line.startsWith(
									this.settings.unfilledStatPrefix
								) &&
								line.match("^.*\\: $")
							) {
								editor.setLine(
									i,
									`${this.settings.unfilledStatPrefix}${line}`
								);
							}

							if (
								line.startsWith(
									this.settings.unfilledStatPrefix
								) &&
								!line.match("^.*\\: $")
							) {
								editor.setLine(
									i,
									line.substring(
										this.settings.unfilledStatPrefix.length
									)
								);
							}
						}
					}
				}
			}
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	// Runs when the plugin is disabled.
	// Any resources that your plugin is using must be released here to avoid
	// affecting the performance of Obsidian after your plugin has been disabled.
	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingsTab extends PluginSettingTab {
	plugin: EmptyStatsHighlighter;

	constructor(app: App, plugin: EmptyStatsHighlighter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Empty Stats Highlighter Settings",
		});

		new Setting(containerEl)
			.setName("Unfilled Stat Prefix")
			.setDesc("Prefixes stats that haven't been filled out yet.")
			.addText((text) =>
				text
					.setPlaceholder("Prefix")
					.setValue(this.plugin.settings.unfilledStatPrefix)
					.onChange(async (value) => {
						// const oldPrefix =
						// 	this.plugin.settings.unfilledStatPrefix;

						this.plugin.settings.unfilledStatPrefix = value;
						await this.plugin.saveSettings();

						// TODO: Remove old prefixes.
					})
			);

		new Setting(containerEl)
			.setName("Templates Directory Name")
			.setDesc(
				"The folder that contains your templates (we won't highlight files here)."
			)
			.addText((text) =>
				text
					.setPlaceholder("Directory")
					.setValue(this.plugin.settings.templatesDirectory)
					.onChange(async (value) => {
						this.plugin.settings.templatesDirectory = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
