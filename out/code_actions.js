"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeActions = void 0;
const vscode_1 = require("vscode");
class CodeActions {
    static updateEnumExt(position, data, uri, extensionName) {
        const edit = new vscode_1.WorkspaceEdit();
        const range = new vscode_1.Range(position, position);
        const textEdit = new vscode_1.TextEdit(range, data);
        edit.set(uri, [textEdit]);
        vscode_1.workspace.applyEdit(edit);
        vscode_1.window.showInformationMessage(`Updated ${extensionName}`);
    }
    static updateEnum(position, data, uri, enumName) {
        const edit = new vscode_1.WorkspaceEdit();
        const range = new vscode_1.Range(position, position);
        const textEdit = new vscode_1.TextEdit(range, data);
        edit.set(uri, [textEdit]);
        vscode_1.workspace.applyEdit(edit);
        vscode_1.window.showInformationMessage(`Updated ${enumName}`);
    }
}
exports.CodeActions = CodeActions;
//# sourceMappingURL=code_actions.js.map