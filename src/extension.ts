import * as vscode from "vscode";
import { Commands } from "./commands";

import {
  Position,
  Range,
  TextDocument,
  WorkspaceEdit,
  commands,
  workspace,
} from "vscode";
import { update } from "lodash";
import EnumExtensionGenerator from "./enum_extension_generator";

// const COMMAND: string = "enumgenerator.generateEnumExtension";
const language = "dart";

export function activate(context: vscode.ExtensionContext) {
  const providedCodeActionKinds = {
    providedCodeActionKinds: EnumExtensionGenerator.providedCodeActionKinds,
  };

  let disposable = vscode.languages.registerCodeActionsProvider(
    language,
    new EnumExtensionGenerator(),
    providedCodeActionKinds
  );

  const generateEnumCommand = vscode.commands.registerCommand(
    Commands.generateEnumExt,
    generateEnumCallback
  );
  const updateEnumCommand = vscode.commands.registerCommand(
    Commands.updateEnumExt,
    updateEnumExtension
  );

  const deleteEnumCommand = vscode.commands.registerCommand(
    Commands.deleteEnumExt,
    deleteEnumExtension
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(generateEnumCommand);
  context.subscriptions.push(updateEnumCommand);
  context.subscriptions.push(deleteEnumCommand);
}

const generateEnumCallback = (
  document: TextDocument,
  position: Position,
  extension: string
) => {
  const edit = new WorkspaceEdit();
  edit.insert(document.uri, position, `\n\n${extension}`);
  workspace.applyEdit(edit);
  commands.executeCommand("editor.action.formatDocument");
};

const updateEnumExtension = (
  position: Position,
  data: string,
  uri: vscode.Uri
) => {
  const edit = new WorkspaceEdit();
  edit.insert(uri, position, data);
  workspace.applyEdit(edit);
  commands.executeCommand("editor.action.formatDocument");
};

const deleteEnumExtension = (prorperies: string[], document: TextDocument) => {
  const edit = new WorkspaceEdit();
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

  workspace.applyEdit(edit);
  commands.executeCommand("editor.action.formatDocument");
};

export function deactivate() {
  // deactivate
}
