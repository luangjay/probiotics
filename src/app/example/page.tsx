"use client";

import { ProbioticCellExpander } from "@/components/rdg/probiotic-cell-expander";
import { useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

// import { useState } from "react";
// import { SortColumn } from "react-data-grid";
// import UseJsonExample from "./use-json-example";

interface Row {
  id: number;
  title: string;
  desc: string;
  expanded?: boolean;
  children?: Row[];
}

const getRows = (): Row[] => [
  {
    id: 0,
    title: "Example",
    desc: "xxxx",
    expanded: false,
    children: [
      { id: 2, title: "Example1", desc: "zzzz" },
      { id: 3, title: "Example2", desc: "tttt" },
    ],
  },
  { id: 1, title: "Demo", desc: "yyyy", expanded: false },
];

export default function App() {
  const [rows, setRows] = useState(getRows);

  const columns: Column<Row>[] = [
    { key: "id", name: "ID" },
    { key: "title", name: "Title" },
    {
      key: "desc",
      name: "Description",
      renderCell: (p) => (
        <ProbioticCellExpander
          {...p}
          expanded={p.row.expanded}
          onCellExpand={() => {
            /*** Do something ***/
            const newRows = [...rows];
            const rowIdx = newRows.findIndex((row) => row.id === p.row.id);
            const row = newRows[rowIdx];
            const children = row.children ?? [];
            row.expanded = !row.expanded;
            if (row.expanded) {
              newRows.splice(rowIdx + 1, 0, ...children);
            } else {
              newRows.splice(rowIdx + 1, children.length);
            }
            setRows(newRows);
          }}
        >
          {p.row.desc}
        </ProbioticCellExpander>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <DataGrid rows={rows} columns={columns} className="flex-1" />
    </div>
  );
}
