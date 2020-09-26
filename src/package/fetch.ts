import * as vscode from "vscode";
import decache from "decache";
import got from "got";

export const fetchSwaggerJson = async () => {
  const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.path;
  const pkgJsonPath = `${rootPath}/package.json`;

  decache(pkgJsonPath);
  const pkgJson = require(pkgJsonPath);

  const swaggerUrl =
    pkgJson?.swaggerUrl ||
    "http://buffett.caijing.alibaba.net:7001/v2/api-docs?group=flowAPI";

  if (!swaggerUrl) {
    vscode.window.showErrorMessage("请在 package.json 中配置 swaggerUrl 字段");
  }

  const jsonSchema = await fetchJson(swaggerUrl);

  return jsonSchema;
};

const fetchJson = async (swaggerUrl: string) => {
  try {
    const res = await got(swaggerUrl);
    return JSON.parse(res.body);
  } catch (error) {
    vscode.window.showErrorMessage("获取数据失败");
  }
};
