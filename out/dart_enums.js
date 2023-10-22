"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartEnum = void 0;
const dart_enum_extension_1 = require("./dart_enum_extension");
const enum_properties_handler_1 = require("./enum_properties_handler");
class DartEnum {
    constructor(name, document, lineNumber) {
        this.name = name;
        this.document = document;
        this.lineNumber = lineNumber;
        this.dartEnumExtension = new dart_enum_extension_1.DartEnumExtension(this.name, this.document);
    }
    // create a getter for properties
    get properties() {
        return this.getProperties();
    }
    addProperty(property) {
        const properties = this.getProperties();
        properties.push(property);
        return properties;
    }
    removeProperty(property) {
        const properties = this.properties.filter((p) => p !== property);
        return properties;
    }
    getProperties() {
        const lineNumber = this.lineNumber;
        return enum_properties_handler_1.default.getProperties(this.document, lineNumber);
    }
    getName() {
        return this.name;
    }
}
exports.DartEnum = DartEnum;
//# sourceMappingURL=dart_enums.js.map