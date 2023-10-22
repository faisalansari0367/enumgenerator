"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumManipulator = void 0;
class EnumManipulator {
    getEnumMembers(document, lineNumber) {
        const line = document.lineAt(lineNumber);
        const properties = [];
        let index = 0;
        while (!line.text.startsWith("}")) {
            const line = document.lineAt(lineNumber + index);
            const text = line.text.trim();
            if (text === "") {
                continue;
            }
            if (text.startsWith("//" || "")) {
                continue; // Ignore comments
            }
            if (text.startsWith(",")) {
                properties.push(text.replace(",", ""));
                continue;
            }
            if (text.startsWith("}")) {
                break;
            }
            if (text.includes("(") && text.includes(")")) {
                const start = text.indexOf("(");
                const end = text.indexOf(")");
                const textWithoutParams = text.substring(0, start);
                properties.push(textWithoutParams.trim());
                continue;
            }
            properties.push(text.replace(",", ""));
            index++;
        }
        return properties;
    }
    propertyToGetter(member, enumName) {
        return `bool get is${member.charAt(0).toUpperCase() + member.substring(1)} => this == ${enumName}.${member};`;
    }
    generateMissingGetters(missingMembers, enumName) {
        let getters = "  ";
        for (let index = 0; index < missingMembers.length; index++) {
            const element = missingMembers[index];
            getters += `${this.propertyToGetter(element, enumName)}\n`;
        }
        return getters;
    }
    getPropertyNameFromGetter(getter) {
        return getter.replace("bool", "").replace("get", "").trim().substring(2);
    }
    extensionExistsFor(enumName, document) {
        const dartCode = document.getText();
        const extensionRegExp = new RegExp(`extension\\s+[^{}]+\\s+on\\s+${enumName}\\s*{`, "s");
        const block = dartCode.match(extensionRegExp);
        if (!block)
            return -1;
        const match = block[0];
        if (!match)
            return -1;
        let index = dartCode.indexOf(match);
        const lines = dartCode.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === match) {
                index = i;
                break;
            }
        }
        return index + 1;
    }
    generateExtension(enumName, enumProperties) {
        let extension = `extension ${enumName}Extension on ${enumName} { \n`;
        for (let index = 0; index < enumProperties.length; index++) {
            const element = enumProperties[index];
            extension += `  ${this.propertyToGetter(element, enumName)}\n`;
        }
        extension += "}";
        return extension;
    }
}
exports.EnumManipulator = EnumManipulator;
//# sourceMappingURL=enum_maniupulator.js.map