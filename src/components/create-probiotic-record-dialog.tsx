"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useProbioticRecordResults } from "@/hooks/use-probiotic-record-results";
import { uploadSheetSchema } from "@/lib/schema";
import { type ProbioticRecordResult } from "@/types/probiotic-record";
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

  // Columns
  const columns = useMemo<Column<ProbioticRecordResult>[]>(
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
          // style={{ gridTemplateColumns: "1fr auto 1fr" }}
          style={{ scrollbarGutter: "stable" }}
          rows={rows}
          columns={columns}
          headerRowHeight={40}
          rowHeight={40}
          onRowsChange={setRows}
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
          <Input id="file" type="file" {...register("fileList")} />
          {errors.fileList && (
            <p className="text-sm text-destructive">
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
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}