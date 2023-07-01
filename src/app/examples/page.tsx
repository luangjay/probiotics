"use client";

import "react-data-grid/lib/styles.css";

import { useState } from "react";
import DataGrid, { SortColumn } from "react-data-grid";

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title", sortable: true },
];

const rows = [
  { id: 0, title: "Example" },
  { id: 1, title: "Demo" },
];

export default function App() {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  return <DataGrid columns={columns} rows={rows} sortColumns={sortColumns} />;
}
