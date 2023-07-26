"use client";

import DataGrid from "react-data-grid";

const rows = [
  { id: 0, title: "Example" },
  { id: 1, title: "Demo" },
];

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
];

export default function Page() {
  return <DataGrid rows={rows} columns={columns} />;
}
