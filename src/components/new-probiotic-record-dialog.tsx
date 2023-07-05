"use client";

import {
  ProbioticEditor,
  refineProbiotic,
} from "@/components/rdg/probiotic-editor";
import { ValueEditor, refineValue } from "@/components/rdg/value-editor";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useProbioticRecordResults } from "@/hooks/use-probiotic-record-results";
import { splitClipboard } from "@/lib/rdg";
import { uploadFileSchema } from "@/lib/schema";
import { type ProbioticRecordResultRow } from "@/types/api/probiotic-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, {
  type CellKeyDownArgs,
  type CellKeyboardEvent,
  type Column,
  type CopyEvent,
} from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";

type UploadFileData = z.infer<typeof uploadFileSchema>;

export function NewProbioticRecordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UploadFileData>({
    mode: "onChange",
    resolver: zodResolver(uploadFileSchema),
  });
  const fileList = useWatch<UploadFileData>({ control, name: "fileList" });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const {
    results: rows,
    setResults: setRows,
    resetResults: resetRows,
    exportFile,
  } = useProbioticRecordResults(file);

  const onSubmit = async () => {
    const file = exportFile();
    const results = Object.fromEntries<number>(
      (
        rows.filter(
          (row) =>
            row.probiotic !== null &&
            row.value !== null &&
            !Number.isNaN(parseFloat(row.value))
        ) as {
          probiotic: string;
          value: string;
        }[]
      ).map((row) => [row.probiotic, parseFloat(row.value)])
    );
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "/api/probiotic-records/cljlrahl8001t7qw31smlqb6z/file",
      {
        method: "POST",
        body: formData,
      }
    );
    console.log(results);
    if (response.ok) {
      const text = await response.text();
      alert(text);
    }
  };

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(() => console.log(rows), [rows]);

  // Columns
  const columns = useMemo<Column<ProbioticRecordResultRow>[]>(
    () => [
      {
        key: "probiotic",
        name: "Probiotic",
        minWidth: 416,
        maxWidth: 416,
        width: 416,
        renderEditCell: (p) => <ProbioticEditor {...p} />,
      },
      {
        key: "value",
        name: "Value",
        minWidth: 91,
        maxWidth: 91,
        width: 91,
        renderEditCell: (p) => <ValueEditor {...p} />,
      },
    ],
    []
  );

  function handleCopy({
    sourceRow,
    sourceColumnKey,
  }: CopyEvent<ProbioticRecordResultRow>): void {
    if (window.isSecureContext) {
      const text = sourceRow[sourceColumnKey as keyof ProbioticRecordResultRow];
      if (typeof text === "string") {
        void navigator.clipboard.writeText(text);
      }
    }
  }

  const handleCellKeyDown = useCallback(
    (
      { row, column }: CellKeyDownArgs<ProbioticRecordResultRow>,
      e: CellKeyboardEvent
    ) => {
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        void navigator.clipboard.readText().then((text) => {
          const pasted = splitClipboard(text);
          const newRows = [...rows];

          const replaceRows = pasted.map((result, idx) => {
            const newIdx = row.idx + idx;
            const probiotic = rows[newIdx]?.probiotic;
            const value = rows[newIdx]?.value;

            const newProbiotic = result[-column.idx];
            const newValue = result[-column.idx + 1];

            return {
              idx: newIdx,
              probiotic: newProbiotic
                ? refineProbiotic(probiotic, newProbiotic)
                : rows[newIdx]?.probiotic ?? null,
              value: newValue
                ? refineValue(value, newValue)
                : rows[newIdx]?.value ?? null,
            };
          });

          newRows.splice(row.idx, pasted.length, ...replaceRows);
          setRows(newRows);
        });
      }
    },
    [rows, setRows]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1 overflow-y-scroll"
          rows={rows}
          columns={columns}
          headerRowHeight={40}
          rowHeight={40}
          onRowsChange={setRows}
          onCopy={handleCopy}
          onCellKeyDown={handleCellKeyDown}
          rowKeyGetter={(row) => row.idx}
          renderers={{
            noRowsFallback: (
              <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, rows, columns, setRows, handleCellKeyDown]
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost">New probiotic record</Button>
      </Dialog.Trigger>
      <Dialog.Content className="sm:h-[90vh] sm:max-w-[576px]">
        <Dialog.Title className="px-1">New probiotic record</Dialog.Title>
        <Dialog.Description className="px-1">
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description>
        <div className="flex flex-col gap-4 overflow-auto p-1">
          <div className="flex gap-2">
            <Input id="file" type="file" {...register("fileList")} />
            {/* <Button id="reset" onClick={void resetRows()}>
              Reset
            </Button> */}
          </div>
          {errors.fileList && (
            <p className="mx-auto text-sm text-destructive">
              {errors.fileList.message}
            </p>
          )}
          {gridElement}
          <form
            className="flex justify-center"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </form>
          {/* <Button
            onClick={() => alert(ref.current?.element?.className)}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            abc
          </Button> */}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
