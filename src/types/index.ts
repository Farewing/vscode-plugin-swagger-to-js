export type Reference = { $ref: string };

export type DefinitionType =
  | "array"
  | "binary"
  | "boolean"
  | "byte"
  | "date"
  | "dateTime"
  | "double"
  | "float"
  | "integer"
  | "long"
  | "number"
  | "object"
  | "password"
  | "string";

export type Method = "get" | "post" | "delete" | "put";

export interface DefinitionSchema {
  additionalProperties?: DefinitionSchema | Reference | boolean;
  allOf?: DefinitionSchema[];
  description?: string;
  enum?: string[];
  format?: string;
  items?: DefinitionSchema | Reference;
  oneOf?: (DefinitionSchema | Reference)[];
  properties?: { [index: string]: DefinitionSchema | Reference };
  required?: string[];
  title?: string;
  type?: DefinitionType; // allow this to be optional to cover cases when this is missing
  [key: string]: any; // allow arbitrary x-something properties
}

export interface ParamsSchema {
  in?: string;
  name?: string;
  description?: string;
  required?: boolean;
  schema: Reference;
}

export interface ResponseSchema {
  description?: string;
  schema: Reference;
}

export interface PathSchema {
  tags?: string[];
  operationId?: string;
  consumes?: string[];
  produces?: string[];
  deprecated?: boolean;
  parameters?: ParamsSchema[];
  responses?: Record<string, ResponseSchema>;
}

export interface Schema {
  definitions: { [key: string]: DefinitionSchema };
  paths: Record<string, Record<Method, PathSchema>>;
  swagger: string;
  tags?: any[];
  [key: string]: any; // handle other properties beyond swagger-to-ts’ concern
}
