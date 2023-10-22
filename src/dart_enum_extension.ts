import { CodeAction, CodeActionKind, Position, TextDocument } from "vscode";
import { Commands } from "./commands";
import EnumPropertiesHandler from "./enum_properties_handler";

export class DartEnumExtension {
  enumName: string;
  document: TextDocument;

  constructor(enumName: string, document: TextDocument) {
    this.document = document;
    this.enumName = enumName;
  }

  private extensionRegExp(enumName: string): RegExp {
    return new RegExp(`extension\\s+[^{}]+\\s+on\\s+${enumName}\\s*{`, "s");
  }

  public doesEnumHaveExtension(enumName: string): boolean {
    const dartCode = this.document.getText();
    const block = dartCode.match(this.extensionRegExp(enumName));
    if (!block) return false;
    const match = block[0];
    if (!match) return false;
    return true;
  }

  private lastLineForExtension(enumName: string): number {
    const dartCode = this.document.getText();
    const block = dartCode.match(this.extensionRegExp(enumName));
    if (!block) return -1;
    const match = block[0];
    if (!match) return -1;
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

  addProperty(property: string) {
    // this.properties.push(property);
  }

  removeProperty(property: string) {
    // this.properties = this.properties.filter((p) => p !== property);
  }

  getExtName(): string {
    return this.enumName + "Ext";
  }

  public generateExtension(enumProperties: string[]): CodeAction {
    const properties = enumProperties;
    let extension = `extension ${this.getExtName()} on ${this.enumName} { \n`;
    for (let index = 0; index < properties.length; index++) {
      const element = properties[index];
      extension += `  ${this.propertyToGetter(element, this.enumName)}\n`;
    }
    extension += "}";

    const codeActionType = CodeActionKind.QuickFix;
    const name = `Generate enum extension ${this.enumName}`;
    const action = new CodeAction(name, codeActionType);
    const lastLine = this.document.lineAt(this.document.lineCount - 1);
    const position = new Position(
      this.document.lineCount - 1,
      lastLine.text.length
    );
    action.command = {
      command: Commands.generateEnumExt,
      title: name,
      arguments: [this.document, position, extension],
    };
    action.isPreferred = true;
    return action;
  }

  private getExtensionProperties(): string[] {
    const lineNumber = this.lastLineForExtension(this.enumName);
    const properties = EnumPropertiesHandler.getProperties(
      this.document,
      lineNumber
    );
    return properties.map((p) => {
      const property = this.getPropertyNameFromGetter(p);
      return property;
    });
  }

  public updateExtension(enumProperties: string[]): CodeAction | undefined {
    try {
      const extensionProperties = this.getExtensionProperties();
    const lineNumber = this.lastLineForExtension(this.enumName);
    if (extensionProperties.length > enumProperties.length) {
      // remove properties
      const missingMembers = extensionProperties.filter(
        (member) => !enumProperties.includes(member)
      );

      let getters = [] as string[];
      for (let index = 0; index < missingMembers.length; index++) {
        const element = missingMembers[index];
        const getter = `  ${this.propertyToGetter(element, this.enumName)}\n`;
        getters.push(getter);
      }

      const codeActionType = CodeActionKind.QuickFix;
      const name = `Delete extension extra properties`;
      const action = new CodeAction(name, codeActionType);
      action.command = {
        command: Commands.deleteEnumExt,
        title: name,
        arguments: [getters, this.document],
      };
      action.isPreferred = true;
      return action;
    }

    if (extensionProperties.length !== enumProperties.length) {
      const missingMembers = enumProperties.filter(
        (member) => !extensionProperties.includes(member)
      );
      let getters = this.generateMissingGetters(missingMembers, this.enumName);
      const position = new Position(lineNumber, 0);
      const codeActionType = CodeActionKind.QuickFix;
      const name = `Update enum extension ${this.enumName}`;
      const action = new CodeAction(name, codeActionType);
      action.command = {
        command: Commands.updateEnumExt,
        title: name,
        arguments: [position, getters, this.document.uri],
      };
      action.isPreferred = true;
      return action;
    }
    } catch (error) {
     console.log(error);
    }
  }

  private generateMissingGetters(
    missingMembers: string[],
    enumName: string
  ): string {
    let getters = "";
    for (let index = 0; index < missingMembers.length; index++) {
      const element = missingMembers[index];
      getters += `  ${this.propertyToGetter(element, enumName)}\n`;
    }
    return getters;
  }

  public propertyToGetter(member: string, enumName: string): string {
    const name = member.charAt(0).toUpperCase() + member.substring(1);
    return `bool get is${name} => this == ${enumName}.${member};`;
  }

  public getPropertyNameFromGetter(getter: string): string {
    const match = getter.match(/bool get is(\w+)/);
    if (match) {
      const name = match[1];
      return name.charAt(0).toLowerCase() + name.substring(1);
    } else {
      throw new Error("Invalid getter method string");
    }
  }
}
