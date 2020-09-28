import * as vscode from "vscode";
import { generate } from "./generate";

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // buffett-flow/info
  const get = vscode.commands.registerCommand("swagger-to-ts.get", () =>
    vscode.window.showInformationMessage("hello world")
  );

  const post = vscode.commands.registerCommand("swagger-to-ts.post", () => {
    try {
      vscode.window.showInformationMessage("post");
      generate("post");
    } catch (error) {
      vscode.window.showErrorMessage(error);
    }
  });

  const put = vscode.commands.registerCommand("swagger-to-ts.put", () =>
    generate("put")
  );

  const deleteM = vscode.commands.registerCommand("swagger-to-ts.delete", () =>
    generate("delete")
  );

  context.subscriptions.push(get, post, put, deleteM);
}
