"use client";

import {
  ProbioticEditor,
  refineProbiotic,
} from "@/components/rdg/probiotic-editor";
import { ValueEditor, refineValue } from "@/components/rdg/value-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useProbioticRecordResult } from "@/hooks/use-probiotic-record-result";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { splitClipboard } from "@/lib/rdg";
import { uploadFileSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { type ProbioticRow } from "@/types/probiotic";
import {
  type ProbioticRecordResultEntry,
  type ProbioticRecordResultRow,
} from "@/types/probiotic-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProbioticRecord } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

interface NewProbioticRecordDialogProps {
  probiotics: ProbioticRow[];
}

export function NewProbioticRecordDialog({
  probiotics,
}: NewProbioticRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { patient } = useSelectPatientStore();

  const probioticNames = useMemo(
    () => probiotics.map((probiotic) => probiotic.name),
    [probiotics]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UploadFileData>({
    mode: "onChange",
    resolver: zodResolver(uploadFileSchema),
  });
  const fileList = useWatch<UploadFileData>({ control, name: "fileList" });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const { rows, setRows, resetRows, exportFile } =
    useProbioticRecordResult(file);

  const onSubmit = async () => {
    const session = await getSession();
    if (!session?.user || !patient?.id) return;
    const doctor = session.user;

    const file = exportFile();
    const result: ProbioticRecordResultEntry[] = (
      rows.filter(
        (row) =>
          row.probiotic !== null &&
          row.value !== null &&
          !Number.isNaN(parseFloat(row.value))
      ) as {
        probiotic: string;
        value: string;
      }[]
    ).map((row) => ({
      probiotic: row.probiotic,
      value: parseFloat(row.value),
    }));

    const postReqBody = {
      doctorId: doctor.id,
      patientId: patient.id,
      result,
    };
    const postResponse = await fetch("/api/probiotic-records", {
      method: "POST",
      body: JSON.stringify(postReqBody),
    });

    if (!postResponse.ok) return;
    const postResBody = (await postResponse.json()) as ProbioticRecord;
    const { id: probioticRecordId } = postResBody;

    const formData = new FormData();
    formData.append("file", file);

    const putResponse = await fetch(
      `/api/probiotic-records/${probioticRecordId}/file`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!putResponse.ok) return;
    setOpen(false);
    router.refresh();
    reset();
  };

  // Component mounted
  useEffect(() => void setLoading(false), []);

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
        minWidth: 90,
        maxWidth: 90,
        width: 90,
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
          rowClass={(row) =>
            cn(
              row.probiotic !== null &&
                !probioticNames.includes(row.probiotic) &&
                "bg-red-100"
            )
          }
          renderers={{
            noRowsFallback: (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ textAlign: "center", gridColumn: "1/-1" }}
              >
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, rows, columns, setRows, handleCellKeyDown, probioticNames]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          New probiotic record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:h-[90vh] sm:max-w-[576px]">
        <DialogTitle className="px-1">New probiotic record</DialogTitle>
        <DialogDescription className="px-1">
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
        <div className="flex flex-col gap-4 overflow-auto p-1">
          <div className="flex gap-2">
            <Input id="file" type="file" {...register("fileList")} />
            <Button onClick={() => void resetRows()}>Reset</Button>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
