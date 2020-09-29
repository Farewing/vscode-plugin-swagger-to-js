import { Schema } from "../types";
import { comment, getNodeType, formatKey } from "./utils";

export function transformRef(ref: string): string {
  const parts = ref.replace(/^#\//, "").split("/");
  return `${parts[0]}["${parts.slice(1).join('"]["')}"]`;
}

export const tsIntersectionOf = (types: string[]): string => {
  return `(${types.join(") & (")})`;
};

export const tsArrayOf = (type: string): string => {
  return `${type}[]`;
};

export const transform = (node: Schema): string => {
  switch (getNodeType(node)) {
    case "ref": {
      return formatKey(node.$ref);
      // return transformRef(node.$ref);
    }
    case "string":
    case "number":
    case "boolean": {
      return getNodeType(node) || "any";
    }
    case "enum": {
      return (node.enum as string[])
        .map((item) =>
          typeof item === "number" || typeof item === "boolean"
            ? item
            : `'${item}'`
        )
        .join(" | ");
    }
    case "object": {
      if (
        (!node.properties || !Object.keys(node.properties).length) &&
        !node.allOf &&
        !node.additionalProperties
      ) {
        return `{ [key: string]: any }`;
      }

      let properties = "";
      if (node.properties && Object.keys(node.properties).length) {
        properties = createKeys(node.properties || {}, node.required);
      }

      // if additional properties, add to end of properties
      if (node.additionalProperties) {
        properties += `[key: string]: ${
          getNodeType(node.additionalProperties) || "any"
        };\n`;
      }
      return `{ ${properties} }`;
      // return tsIntersectionOf([
      //   ...(node.allOf ? (node.allOf as any[]).map(transform) : []), // append allOf first
      //   ...(properties ? [`{ ${properties} }`] : []), // then properties + additionalProperties
      // ]);
    }
    case "array": {
      return tsArrayOf(transform(node.items as any));
    }
  }

  return "";
};

export const createKeys = (
  obj: { [key: string]: any },
  required: string[] = []
): string => {
  let output = "";

  Object.entries(obj).forEach(([key, value]) => {
    // 1. JSDoc comment (goes above property)
    if (value.description) {
      output += comment(value.description);
    }

    // 2. name (with “?” if optional property)
    output += `"${key}"${!required || !required.includes(key) ? "?" : ""}: `;

    // 3. get value
    output += transform(value);

    // 4. close type
    output += ";\n";
  });

  return output;
};

export const createInterface = (obj: { [key: string]: any }) => {
  let output = "";
  Object.entries(obj).forEach(([key, value]) => {
    if (value.description) {
      output += comment(value.description);
    }

    // const name = getDefinitionKey(key);

    output += `interface ${formatKey(key)}  ${transform(value)};\n`;
  });

  return output;
};
