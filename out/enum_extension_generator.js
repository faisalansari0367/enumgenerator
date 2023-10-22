"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const dart_enums_1 = require("./dart_enums");
class EnumExtensionGenerator {
    provideCodeActions(document, range) {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return;
        const line = document.lineAt(range.start.line);
        const enumDeclarationRegex = /enum\s+([\w\d_]+)\s*{/;
        const enumMatch = line.text.match(enumDeclarationRegex);
        // check if active line is the enum declaration
        const isEnum = line.text.startsWith("enum ");
        if (!isEnum)
            return;
        const enumName = (enumMatch === null || enumMatch === void 0 ? void 0 : enumMatch[1]) || "";
        if (!enumName)
            return;
        const codeActions = [];
        // check if enum has extension
        const dartEnum = new dart_enums_1.DartEnum(enumName, document, line.lineNumber + 1);
        const hasExtension = dartEnum.dartEnumExtension.doesEnumHaveExtension(enumName);
        // if not, create extension
        if (!hasExtension) {
            const extension = dartEnum.dartEnumExtension.generateExtension(dartEnum.properties);
            codeActions.push(extension);
        }
        else {
            const extension = dartEnum.dartEnumExtension.updateExtension(dartEnum.properties);
            if (extension)
                codeActions.push(extension);
        }
        return codeActions;
    }
}
EnumExtensionGenerator.providedCodeActionKinds = [vscode_1.CodeActionKind.QuickFix];
exports.default = EnumExtensionGenerator;
//# sourceMappingURL=enum_extension_generator.js.map