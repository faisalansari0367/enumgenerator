"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const commands_1 = require("./commands");
const vscode_1 = require("vscode");
const enum_extension_generator_1 = require("./enum_extension_generator");
// const COMMAND: string = "enumgenerator.generateEnumExtension";
const language = "dart";
function activate(context) {
    const providedCodeActionKinds = {
        providedCodeActionKinds: enum_extension_generator_1.default.providedCodeActionKinds,
    };
    let disposable = vscode.languages.registerCodeActionsProvider(language, new enum_extension_generator_1.default(), providedCodeActionKinds);
    const generateEnumCommand = vscode.commands.registerCommand(commands_1.Commands.generateEnumExt, generateEnumCallback);
    const updateEnumCommand = vscode.commands.registerCommand(commands_1.Commands.updateEnumExt, updateEnumExtension);
    const deleteEnumCommand = vscode.commands.registerCommand(commands_1.Commands.deleteEnumExt, deleteEnumExtension);
    context.subscriptions.push(disposable);
    context.subscriptions.push(generateEnumCommand);
    context.subscriptions.push(updateEnumCommand);
    context.subscriptions.push(deleteEnumCommand);
}
exports.activate = activate;
const generateEnumCallback = (document, position, extension) => {
    const edit = new vscode_1.WorkspaceEdit();
    edit.insert(document.uri, position, `\n\n${extension}`);
    vscode_1.workspace.applyEdit(edit);
    vscode_1.commands.executeCommand("editor.action.formatDocument");
};
const updateEnumExtension = (position, data, uri) => {
    const edit = new vscode_1.WorkspaceEdit();
    edit.insert(uri, position, data);
    vscode_1.workspace.applyEdit(edit);
    vscode_1.commands.executeCommand("editor.action.formatDocument");
};
const deleteEnumExtension = (prorperies, document) => {
    const edit = new vscode_1.WorkspaceEdit();
    const lines = document.getText().split("\n");
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        for (let extProperty = 0; extProperty < prorperies.length; extProperty++) {
            const element = prorperies[extProperty];
            if (element.trim() === line.trim()) {
                const range = document.lineAt(index).range;
                edit.delete(document.uri, range);
            }
        }
    }
    vscode_1.workspace.applyEdit(edit);
    vscode_1.commands.executeCommand("editor.action.formatDocument");
};
function deactivate() {
    // deactivate
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map