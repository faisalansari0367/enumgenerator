import {
  Position,
  Uri,
  WorkspaceEdit,
  Range,
  TextEdit,
  workspace,
  window,
} from "vscode";

export class CodeActions {
  public static updateEnumExt(
    position: Position,
    data: string,
    uri: Uri,
    extensionName: string
  ) {
    const edit = new WorkspaceEdit();
    const range = new Range(position, position);
    const textEdit = new TextEdit(range, data);
    edit.set(uri, [textEdit]);
    workspace.applyEdit(edit);
    window.showInformationMessage(`Updated ${extensionName}`);
  }

  public static updateEnum(
    position: Position,
    data: string,
    uri: Uri,
    enumName: string
  ) {
    const edit = new WorkspaceEdit();
    const range = new Range(position, position);
    const textEdit = new TextEdit(range, data);
    edit.set(uri, [textEdit]);
    workspace.applyEdit(edit);
    window.showInformationMessage(`Updated ${enumName}`);
  }
}
