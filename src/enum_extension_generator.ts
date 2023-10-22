import {
  CodeActionProvider,
  TextDocument,
  CodeAction,
  Range,
  CodeActionKind,
  window,
} from "vscode";

import { DartEnum } from "./dart_enums";

class EnumExtensionGenerator implements CodeActionProvider {
  public static readonly providedCodeActionKinds = [CodeActionKind.QuickFix];

  public provideCodeActions(
    document: TextDocument,
    range: Range
  ): CodeAction[] | undefined {
    const editor = window.activeTextEditor;
    if (!editor) return;

    const line = document.lineAt(range.start.line);
    const enumDeclarationRegex = /enum\s+([\w\d_]+)\s*{/;
    const enumMatch = line.text.match(enumDeclarationRegex);

    // check if active line is the enum declaration
    const isEnum = line.text.startsWith("enum ");
    if (!isEnum) return;
    const enumName = enumMatch?.[1] || "";
    if (!enumName) return;

    const codeActions = [] as CodeAction[];

    // check if enum has extension

    const dartEnum = new DartEnum(enumName, document, line.lineNumber + 1);
    const hasExtension =
      dartEnum.dartEnumExtension.doesEnumHaveExtension(enumName);

    // if not, create extension
    if (!hasExtension) {
      const extension = dartEnum.dartEnumExtension.generateExtension(
        dartEnum.properties
      );
      codeActions.push(extension);
    } else {
      const extension = dartEnum.dartEnumExtension.updateExtension(
        dartEnum.properties
      );
      if (extension) codeActions.push(extension);
    }

    return codeActions;
  }
}

export default EnumExtensionGenerator;
