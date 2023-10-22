import { TextDocument } from "vscode";

class EnumPropertiesHandler {
  public static getProperties(document: TextDocument, lineNumber: number) : string[] {
    const line = document.lineAt(lineNumber);
    const properties = [];
    let index = 0;
    while (!line.text.startsWith("}")) {
      const line = document.lineAt(lineNumber + index);
      const text = line.text.trim();
      if (text === "") {
        index++;
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
}


export default EnumPropertiesHandler;