import React from 'react';

export interface columnsrsvp {
  id: string;
  sr_no: number;
  name: string;
  phone: string;
  inviteType: string;
  status: string;
  responses: string;
  timestamp: string;
}

export interface CustomColumn<T = columnsrsvp> {
  title: string;
  dataIndex: keyof T;
  key: string;
  enableSearch?: boolean;
  enableSort?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  width?: number | string;
}

export interface RSVPTableProps {
  data?: columnsrsvp[];
  loading?: boolean;
  columns?: CustomColumn<columnsrsvp>[];
}

