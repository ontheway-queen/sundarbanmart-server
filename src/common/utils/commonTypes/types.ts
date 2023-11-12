import { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2/promise';

export type TCompare = '>' | '>=' | '<' | '<=' | '=' | '!=' | 'is' | 'not';

export type TWhere = {
  and?: {
    table: string;
    field: string;
    value: string | number;
    compare?: TCompare;
  }[];
  or?: {
    table: string;
    field: string;
    value: string | number;
    compare?: TCompare;
  }[];
};

export type TOrder_details = {
  product_name: string;
  product_category: string;
  product_id: number;
  price: number;
  quantity: number;
  queen_id: number;
  delivery_date: string;
};

export type TCredType = {
  table: string;
  fields?: {
    columns?: string[];
    as?: [string, string][];
    otherFields?: {
      table: string;
      columns?: string[];
      as?: [string, string][];
    }[];
  };

  where?:
    | {
        table: string;
        field: string;
        value: string | number;
        compare?: TCompare;
        date?: true;
      }
    | TWhere;
  all?: true;
  special?: string | string[];
  limit?: { skip: number | string; limit: number | string };
  join?: {
    join: { table: string; field: string };
    on: { table: string; field: string };
  }[];
  orderBy?: { table: string; field: string };
  groupBy?: { table: string; field: string };
  asc?: true;
  desc?: true;
};

export type TDelCred = {
  table: string;
  where?: object;
  and?: { field: string; value: number | string }[];
};
export type TRowDataPacket = [RowDataPacket[], FieldPacket[]];
export type TResultSetHeader = [ResultSetHeader, FieldPacket[]];
export type TRaw =
  | [RowDataPacket[], FieldPacket[]]
  | [ResultSetHeader, FieldPacket]
  | { total: number }[];
