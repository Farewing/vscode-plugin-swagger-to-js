import * as vscode from "vscode";
import { generate } from "./index";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extension" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // buffett-flow/info
  const get = vscode.commands.registerCommand("extension.get", () =>
    generate("get")
  );

  const post = vscode.commands.registerCommand("extension.post", () =>
    generate("post")
  );

  const put = vscode.commands.registerCommand("extension.put", () =>
    generate("put")
  );

  const deleteM = vscode.commands.registerCommand("extension.delete", () =>
    generate("delete")
  );

  context.subscriptions.push(post);
}

// this method is called when your extension is deactivated
export function deactivate() {}
