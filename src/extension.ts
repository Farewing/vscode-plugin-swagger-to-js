import * as vscode from "vscode";
import { generate } from "./index";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "swagger-to-ts" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  ///buffett-flow/info
  const disposable = vscode.commands.registerCommand("swagger-to-ts.get", () =>
    generate("get")
  );

  const disposable2 = vscode.commands.registerCommand(
    "swagger-to-ts.post",
    () => generate("post")
  );

  const disposable3 = vscode.commands.registerCommand("swagger-to-ts.put", () =>
    generate("put")
  );

  const disposable4 = vscode.commands.registerCommand(
    "swagger-to-ts.delete",
    () => generate("delete")
  );

  context.subscriptions.push(disposable, disposable2, disposable3, disposable4);
}

// this method is called when your extension is deactivated
export function deactivate() {}
