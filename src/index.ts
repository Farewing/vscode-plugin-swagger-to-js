import * as vscode from "vscode";
import { fetchSwaggerJson } from "./package/fetch";
import { generateTypes } from "./package";
import * as clipboardy from "clipboardy";
import { Method } from "./types";

export const generate = async (method: Method) => {
  try {
    const jsonSchema = await fetchSwaggerJson();
    const result = generateTypes(jsonSchema, "/buffett-flow/interim", method);
    console.log(result);
    await clipboardy.write(result);
  } catch (error) {
    vscode.window.showErrorMessage("发送错误");
    throw new Error(error);
  }
};
