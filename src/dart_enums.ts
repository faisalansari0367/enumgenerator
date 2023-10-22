import { TextDocument } from "vscode";
import { DartEnumExtension } from "./dart_enum_extension";
import EnumPropertiesHandler from "./enum_properties_handler";

export class DartEnum {
  name: string;

  dartEnumExtension: DartEnumExtension;
  document: TextDocument;
  lineNumber: number;

  constructor(name: string, document: TextDocument, lineNumber: number) {
    this.name = name;
    this.document = document;
    this.lineNumber = lineNumber;
    this.dartEnumExtension = new DartEnumExtension(this.name, this.document);
  }

  // create a getter for properties
  get properties(): string[] {
    return this.getProperties();
  }

  addProperty(property: string): string[] {
    const properties = this.getProperties();
    properties.push(property);
    return properties;
  }

  removeProperty(property: string): string[] {
    const properties = this.properties.filter((p) => p !== property);
    return properties;
  }

  getProperties(): string[] {
    const lineNumber = this.lineNumber;
    return EnumPropertiesHandler.getProperties(this.document, lineNumber);
  }

  getName(): string {
    return this.name;
  }
}
