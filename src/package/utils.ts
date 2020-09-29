import { Reference, Schema } from "../types";

/**
 * 增加 JSDoc
 * @param text
 */
export function comment(text: string): string {
  return `/**
  * ${text.trim().replace("\n+$", "").replace(/\n/g, "\n  * ")}
  */
`;
}

type SchemaObjectType =
  | "anyOf"
  | "array"
  | "boolean"
  | "enum"
  | "number"
  | "object"
  | "oneOf"
  | "ref"
  | "string"
  | "any";

/**
 * 获取节点类型
 * @param obj
 */
export function getNodeType(obj: any): SchemaObjectType | undefined {
  if (!obj || typeof obj !== "object") {
    return undefined;
  }

  if (obj["$ref"]) {
    return "ref";
  }

  // enum
  if (Array.isArray(obj.enum)) {
    return "enum";
  }

  // boolean
  if (obj.type === "boolean") {
    return "boolean";
  }

  // string
  if (
    ["binary", "byte", "date", "dateTime", "password", "string"].includes(
      obj.type
    )
  ) {
    return "string";
  }

  // number
  if (["double", "float", "integer", "number"].includes(obj.type)) {
    return "number";
  }

  // anyOf
  if (Array.isArray(obj.anyOf)) {
    return "anyOf";
  }

  // oneOf
  if (Array.isArray(obj.oneOf)) {
    return "oneOf";
  }

  // array
  if (obj.type === "array" || obj.items) {
    return "array";
  }

  if (obj.type === "object" && Object.keys(obj).length === 1) {
    return "any";
  }

  // return object by default
  return "object";
}

export const getDefinitionKey = (str: string): string => {
  return str.split("/").pop() || "";
};

export const formatKey = (str: string): string => {
  const key = getDefinitionKey(str);
  return key.replace(/»/g, "").replace(/«/g, "_");
};

export const pickObjofKeys = (
  obj: { [key: string]: any },
  keys: string[]
): { [key: string]: any } => {
  const res = {} as any;
  keys.forEach((item) => {
    const key = getDefinitionKey(item);
    res[key] = obj[key];
  });

  return res;
};

export const getSchemaAndKeys = (
  definitions: Schema["definitions"],
  ref: Reference
) => {
  const refSchema = definitions[getDefinitionKey(ref.$ref)];

  const contentSchema = refSchema?.properties?.content
    ? refSchema?.properties?.content
    : refSchema;

  const keys = contentSchema?.$ref ? [contentSchema.$ref] : [refSchema.$ref];

  const schema = contentSchema?.$ref
    ? definitions[getDefinitionKey(contentSchema.$ref)]
    : contentSchema;

  return { schema, keys };
};
