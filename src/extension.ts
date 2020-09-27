import * as vscode from "vscode";
import { generate } from "./index";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "swagger-to-ts" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // buffett-flow/info
  const get = vscode.commands.registerCommand("swagger-to-ts.get", () =>
    generate("get")
  );

  const post = vscode.commands.registerCommand(
    "swagger-to-ts.post",
    async () => await generate("post")
  );

  const put = vscode.commands.registerCommand("swagger-to-ts.put", () =>
    generate("put")
  );

  const deleteM = vscode.commands.registerCommand("swagger-to-ts.delete", () =>
    generate("delete")
  );

  context.subscriptions.push(post);
}

// this method is called when your extension is deactivated
export function deactivate() {}
