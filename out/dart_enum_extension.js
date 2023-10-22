"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartEnumExtension = void 0;
const vscode_1 = require("vscode");
const commands_1 = require("./commands");
const enum_properties_handler_1 = require("./enum_properties_handler");
class DartEnumExtension {
    constructor(enumName, document) {
        this.document = document;
        this.enumName = enumName;
    }
    extensionRegExp(enumName) {
        return new RegExp(`extension\\s+[^{}]+\\s+on\\s+${enumName}\\s*{`, "s");
    }
    doesEnumHaveExtension(enumName) {
        const dartCode = this.document.getText();
        const block = dartCode.match(this.extensionRegExp(enumName));
        if (!block)
            return false;
        const match = block[0];
        if (!match)
            return false;
        return true;
    }
    lastLineForExtension(enumName) {
        const dartCode = this.document.getText();
        const block = dartCode.match(this.extensionRegExp(enumName));
        if (!block)
            return -1;
        const match = block[0];
        if (!match)
            return -1;
        let index = 0;
        const lines = dartCode.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === match.trim()) {
                index = i;
                break;
            }
        }
        return index + 1;
    }
    addProperty(property) {
        // this.properties.push(property);
    }
    removeProperty(property) {
        // this.properties = this.properties.filter((p) => p !== property);
    }
    getExtName() {
        return this.enumName + "Ext";
    }
    generateExtension(enumProperties) {
        const properties = enumProperties;
        let extension = `extension ${this.getExtName()} on ${this.enumName} { \n`;
        for (let index = 0; index < properties.length; index++) {
            const element = properties[index];
            extension += `  ${this.propertyToGetter(element, this.enumName)}\n`;
        }
        extension += "}";
        const codeActionType = vscode_1.CodeActionKind.QuickFix;
        const name = `Generate enum extension ${this.enumName}`;
        const action = new vscode_1.CodeAction(name, codeActionType);
        const lastLine = this.document.lineAt(this.document.lineCount - 1);
        const position = new vscode_1.Position(this.document.lineCount - 1, lastLine.text.length);
        action.command = {
            command: commands_1.Commands.generateEnumExt,
            title: name,
            arguments: [this.document, position, extension],
        };
        action.isPreferred = true;
        return action;
    }
    getExtensionProperties() {
        const lineNumber = this.lastLineForExtension(this.enumName);
        const properties = enum_properties_handler_1.default.getProperties(this.document, lineNumber);
        return properties.map((p) => {
            const property = this.getPropertyNameFromGetter(p);
            return property;
        });
    }
    updateExtension(enumProperties) {
        try {
            const extensionProperties = this.getExtensionProperties();
            const lineNumber = this.lastLineForExtension(this.enumName);
            if (extensionProperties.length > enumProperties.length) {
                // remove properties
                const missingMembers = extensionProperties.filter((member) => !enumProperties.includes(member));
                let getters = [];
                for (let index = 0; index < missingMembers.length; index++) {
                    const element = missingMembers[index];
                    const getter = `  ${this.propertyToGetter(element, this.enumName)}\n`;
                    getters.push(getter);
                }
                const codeActionType = vscode_1.CodeActionKind.QuickFix;
                const name = `Delete extension extra properties`;
                const action = new vscode_1.CodeAction(name, codeActionType);
                action.command = {
                    command: commands_1.Commands.deleteEnumExt,
                    title: name,
                    arguments: [getters, this.document],
                };
                action.isPreferred = true;
                return action;
            }
            if (extensionProperties.length !== enumProperties.length) {
                const missingMembers = enumProperties.filter((member) => !extensionProperties.includes(member));
                let getters = this.generateMissingGetters(missingMembers, this.enumName);
                const position = new vscode_1.Position(lineNumber, 0);
                const codeActionType = vscode_1.CodeActionKind.QuickFix;
                const name = `Update enum extension ${this.enumName}`;
                const action = new vscode_1.CodeAction(name, codeActionType);
                action.command = {
                    command: commands_1.Commands.updateEnumExt,
                    title: name,
                    arguments: [position, getters, this.document.uri],
                };
                action.isPreferred = true;
                return action;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    generateMissingGetters(missingMembers, enumName) {
        let getters = "";
        for (let index = 0; index < missingMembers.length; index++) {
            const element = missingMembers[index];
            getters += `  ${this.propertyToGetter(element, enumName)}\n`;
        }
        return getters;
    }
    propertyToGetter(member, enumName) {
        const name = member.charAt(0).toUpperCase() + member.substring(1);
        return `bool get is${name} => this == ${enumName}.${member};`;
    }
    getPropertyNameFromGetter(getter) {
        const match = getter.match(/bool get is(\w+)/);
        if (match) {
            const name = match[1];
            return name.charAt(0).toLowerCase() + name.substring(1);
        }
        else {
            throw new Error("Invalid getter method string");
        }
    }
}
exports.DartEnumExtension = DartEnumExtension;
//# sourceMappingURL=dart_enum_extension.js.map