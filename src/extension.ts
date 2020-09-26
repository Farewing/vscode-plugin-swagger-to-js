import * as vscode from "vscode";
import { fetchSwaggerJson } from "./package/fetch";
import { generateTypes } from "./package";
import * as clipboardy from 'clipboardy'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "swagger-to-ts" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "swagger-to-ts.helloWorld",
    async () => {
      const jsonSchema = await fetchSwaggerJson();
      const result = generateTypes(jsonSchema, "/buffett-flow/info", "post");
      console.log(result)
      await clipboardy.write(result)
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
