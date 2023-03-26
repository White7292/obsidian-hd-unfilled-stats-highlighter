import {
	App,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
	normalizePath,
} from "obsidian";

interface UnfilledStatsHighlighterSettings {
	statRegex: string;
	unfilledStatPrefix: string;
	templatesDirectory: string;
	targetHighlightingDirectory: string;
}

const DEFAULT_SETTINGS: UnfilledStatsHighlighterSettings = {
	statRegex: "^.*\\: $",
	unfilledStatPrefix: "__",
	templatesDirectory: "Templates",
	targetHighlightingDirectory: "Journaling",
};

export default class UnfilledStatsHighlighter extends Plugin {
	settings: UnfilledStatsHighlighterSettings;

	// Runs whenever the user starts using the plugin in Obsidian.
	// This is where you'll configure most of the plugin's capabilities.
	// This function is also called when the plugin is updated.
	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of
		// the plugin.
		this.addSettingTab(
			new UnfilledStatsHighlighterSettingsTab(this.app, this)
		);

		// If the plugin hooks up any global DOM events (on parts of the app that
		// doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when
		// this plugin is disabled.
		this.registerDomEvent(document, "keyup", (evt: KeyboardEvent) => {
			const activeFile = this.app.workspace.getActiveFile();

			if (
				!activeFile?.path.contains(
					`${this.settings.templatesDirectory}/`
				) &&
				activeFile?.path.contains(
					`${this.settings.targetHighlightingDirectory}/`
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
								line.match(this.settings.statRegex)
							) {
								editor.setLine(
									i,
									`${this.settings.unfilledStatPrefix}${line}`
								);
							} else if (
								line.startsWith(
									this.settings.unfilledStatPrefix
								) &&
								!line.match(this.settings.statRegex)
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

class UnfilledStatsHighlighterSettingsTab extends PluginSettingTab {
	plugin: UnfilledStatsHighlighter;

	constructor(app: App, plugin: UnfilledStatsHighlighter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Unfilled Stats Highlighter Settings",
		});

		new Setting(containerEl)
			.setName("Stat Regex")
			.setDesc(
				"Lines that match this javascript regex are considered stats."
			)
			.addText((text) =>
				text
					.setPlaceholder("Regex")
					.setValue(this.plugin.settings.statRegex)
					.onChange(async (value) => {
						this.plugin.settings.statRegex = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Unfilled Stat Prefix")
			.setDesc("Prefixes stats that haven't been filled out yet.")
			.addText((text) =>
				text
					.setPlaceholder("Prefix")
					.setValue(this.plugin.settings.unfilledStatPrefix)
					.onChange(async (value) => {
						this.plugin.settings.unfilledStatPrefix = value;
						await this.plugin.saveSettings();
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
						this.plugin.settings.templatesDirectory =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Target Highlighting Directory Name")
			.setDesc("The folder that contains your stats to highlight.")
			.addText((text) =>
				text
					.setPlaceholder("Stats Directory")
					.setValue(this.plugin.settings.targetHighlightingDirectory)
					.onChange(async (value) => {
						this.plugin.settings.targetHighlightingDirectory =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
