import * as prettier from "prettier";
import { Schema, Method, Reference, DefinitionSchema } from "../types";
import {
  getNodeType,
  pickObjofKeys,
  getSchemaAndKeys,
  getDefinitionKey,
} from "./utils";
import { createInterface } from "./format";

/**
 * 获取 请求参数和返回值的 keys
 * @param jsonSchema
 * @param url
 * @param method
 */
const getDefinition = (
  jsonSchema: Schema,
  url: string,
  method: Method = "get"
): {
  paramsKeys: string[];
  resKeys: string[];
} => {
  const { paths, definitions } = jsonSchema;
  const urlSchema = paths[url];
  if (!urlSchema) {
    throw new Error("未找到对应 URL 的定义");
  }
  const methodSchema = urlSchema[method];
  if (!methodSchema) {
    throw new Error("未找到对应请求方式的定义");
  }

  const paramsSchema = methodSchema?.parameters
    ? methodSchema?.parameters[0]?.schema
    : ({} as Reference);
  const resSchema = methodSchema?.responses
    ? methodSchema?.responses["200"]?.schema
    : ({} as Reference);

  const paramsKeys: string[] = [];

  const { schema: resRefSchema, keys: resKeys } = getSchemaAndKeys(
    definitions,
    resSchema
  );

  getKeys(resRefSchema, resKeys, definitions);
  getKeys(paramsSchema, paramsKeys, definitions);

  return { paramsKeys, resKeys };
};

/**
 * 获取使用到 definitions 中的 keys
 * @param node
 * @param keys
 */
const getKeys = (
  node: DefinitionSchema,
  keys: string[],
  definitions: Schema["definitions"]
) => {
  switch (getNodeType(node)) {
    case "ref": {
      // const refSchema = definitions[getDefinitionKey(node.$ref)];
      // getKeys(refSchema, keys, definitions);
      if (!keys.includes(node.$ref)) {
        keys.unshift(node.$ref);
        getKeys(definitions[getDefinitionKey(node.$ref)], keys, definitions);
      }
      break;
    }
    case "array": {
      getKeys(node.items as any, keys, definitions);
      break;
    }
    case "object": {
      if (
        (!node.properties || !Object.keys(node.properties).length) &&
        !node.allOf &&
        !node.additionalProperties
      ) {
        break;
      }

      if (node.properties) {
        Object.entries(node.properties).forEach(([key, value]) => {
          getKeys(value, keys, definitions);
        });
      }

      if (node.additionalProperties) {
        Object.entries(node.additionalProperties).forEach(([key, value]) => {
          getKeys(value, keys, definitions);
        });
      }
      break;
    }
  }
};

export const generateTypes = (
  jsonSchema: Schema,
  url: string,
  method: Method = "get"
): string => {
  const { resKeys, paramsKeys } = getDefinition(jsonSchema, url, method);

  const resDefinitions = pickObjofKeys(jsonSchema.definitions, resKeys);
  const paramsDefinitions = pickObjofKeys(jsonSchema.definitions, paramsKeys);

  const result = `${createInterface(paramsDefinitions)} \n\n  ${createInterface(
    resDefinitions
  )} `;

  return result;

  // return prettier.format(result, {
  //   singleQuote: true,
  //   parser: "typescript",
  // });
};
