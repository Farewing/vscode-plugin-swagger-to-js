import * as vscode from "vscode";
import { fetchSwaggerJson } from "./package/fetch";
import { generateTypes } from "./package";
import * as clipboardy from "clipboardy";
import { Method } from "./types";
import { Selection } from "vscode";

const langList = [
  "typescript",
  "javascript",
  "typescriptreact",
  "javascriptreact",
  "json",
];

export const generate = async (method: Method) => {
  const lang = vscode.window.activeTextEditor?.document.languageId || "";
  if (!langList.includes(lang)) {
    vscode.window.showInformationMessage("Only support ts, js or json file");
    return;
  }

  const selection = vscode.window.activeTextEditor?.selection as Selection;
  // const startLine = selection.start.line - 1;
  const selectedText = vscode.window.activeTextEditor?.document.getText(
    selection
  ) as string;

  if (selectedText.length === 0) {
    vscode.window.showInformationMessage("Please select request url ");
    return;
  }

  const url = selectedText.replace(/'/g, "");

  try {
    const jsonSchema = await fetchSwaggerJson();
    const result = generateTypes(jsonSchema, url, method);

    await clipboardy.write(result);
    vscode.window.showInformationMessage("生成成功，已复制到粘贴板");
  } catch (error) {
    // vscode.window.showErrorMessage("发送错误");
    throw new Error(error);
  }
};
