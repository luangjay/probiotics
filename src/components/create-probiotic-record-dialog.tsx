"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useProbioticRecordResults } from "@/hooks/use-probiotic-record-results";
import { splitClipboard } from "@/lib/rdg";
import { uploadSheetSchema } from "@/lib/schema";
import { type ProbioticRecordResultRow } from "@/types/probiotic-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";
import { TextEditor } from "./renderers/text-editor";

type UploadFileData = z.infer<typeof uploadSheetSchema>;

export function CreateProbioticRecordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UploadFileData>({
    mode: "onChange",
    resolver: zodResolver(uploadSheetSchema),
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

  useEffect(() => void console.log(file), [file]);

  useEffect(() => void console.log(rows), [rows]);

  // const handlePaste = () => {
  //   console.log("assdasd");
  //   void navigator.clipboard.readText().then((text) => {
  //     alert(text);
  //   });
  // };

  // Columns
  const columns = useMemo<Column<ProbioticRecordResultRow>[]>(
    () => [
      {
        key: "probiotic",
        name: "Probiotic",
        minWidth: 416,
        maxWidth: 416,
        width: 416,
        renderEditCell: (p) => <TextEditor {...p} />,
      },
      {
        key: "value",
        name: "Value",
        minWidth: 91,
        maxWidth: 91,
        width: 91,
        renderEditCell: (p) => <TextEditor {...p} />,
      },
    ],
    []
  );

  // function handlePaste({
  //   sourceColumnKey,
  //   sourceRow,
  //   targetColumnKey,
  //   targetRow,
  // }: PasteEvent<ProbioticRecordResult>): ProbioticRecordResult {
  //   console.log("aaa");
  //   return {
  //     ...targetRow,
  //     [targetColumnKey]:
  //       sourceRow[sourceColumnKey as keyof ProbioticRecordResult],
  //   };
  // }

  // useEffect(()=>{
  //   const rdg = ref.current
  //   rdg?.
  // },[])

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
          onCellKeyDown={({ row, column }, e) => {
            if (e.ctrlKey && e.key === "v") {
              e.preventDefault();
              void navigator.clipboard.readText().then((text) => {
                const pasted = splitClipboard(text); //.map((r)=>);
                // switch (column.idx) {
                //   case 0:
                const newRows = [...rows];
                const replaceRows = pasted.map((result, i) => {
                  const idx = row.idx + i;
                  return {
                    idx,
                    probiotic: result[-column.idx] ?? rows[idx].probiotic,
                    value: result[1 - column.idx] ?? rows[idx].value,
                  };
                });
                newRows.splice(row.idx, pasted.length, ...replaceRows);
                setRows(newRows);
                //   case 1:
                // }
              });
            }
          }}
          // onPaste={handlePaste}
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
    [loading, rows, columns, setRows]
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
