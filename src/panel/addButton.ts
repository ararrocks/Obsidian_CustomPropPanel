import { App, Modal, Notice } from 'obsidian';

class InputModal extends Modal {
    private onSubmit: (value: string) => void;

    constructor(app: App, onSubmit: (value: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        let { contentEl } = this;

        contentEl.createEl('h2', { text: 'Enter New Name' });

        const inputContainer = contentEl.createDiv();
        const inputField = inputContainer.createEl('input', { type: 'text', placeholder: 'Enter a new name' });

        const submitButton = contentEl.createEl('button', { text: 'Submit' });
        submitButton.addEventListener('click', () => {
            const inputValue = inputField.value;

            if (inputValue) {
                this.onSubmit(inputValue);
                this.close();
            } else {
                new Notice('Please enter a value');
            }
        });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

export function addButton(app: App, container: HTMLElement, buttonLabel: string, yamlProperty: string) {
    const button = container.createEl('button', { text: buttonLabel });
    button.onclick = () => {
        new InputModal(app, (inputValue: string) => {
            const activeFile = app.workspace.getActiveFile();
            if (activeFile) {
                app.vault.read(activeFile).then(content => {
                    const lines = content.split('\n');
                    const yamlStartIndex = lines.findIndex(line => line === '---');
                    const yamlEndIndex = lines.findIndex((line, index) => index > yamlStartIndex && line === '---');

                    if (yamlStartIndex !== -1 && yamlEndIndex !== -1) {
                        const yamlLines = lines.slice(yamlStartIndex + 1, yamlEndIndex);
                        const yamlContent = yamlLines.join('\n');
                        const yamlData = app.metadataCache.getFileCache(activeFile)?.frontmatter || {};

                        yamlData[yamlProperty] = inputValue;

                        const newYamlContent = Object.entries(yamlData)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n');

                        const newContent = [
                            ...lines.slice(0, yamlStartIndex + 1),
                            newYamlContent,
                            ...lines.slice(yamlEndIndex)
                        ].join('\n');

                        app.vault.modify(activeFile, newContent);
                        new Notice(`Updated ${yamlProperty} to ${inputValue}`);
                    } else {
                        new Notice('No YAML frontmatter found in the active file.');
                    }
                });
            }
        }).open();
    };

    container.appendChild(button);
}