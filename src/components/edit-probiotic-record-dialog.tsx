"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import {
  ProbioticEditor,
  refineProbiotic,
} from "@/components/rdg/probiotic-editor";
import { ValueEditor, refineValue } from "@/components/rdg/value-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProbioticRecordResult } from "@/hooks/use-probiotic-record-result";
import { splitClipboard } from "@/lib/rdg";
import { uploadResultSchema as baseUploadResultSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { type ProbioticRow } from "@/types/probiotic";
import {
  type ProbioticRecordResultEntry,
  type ProbioticRecordResultRow,
  type ProbioticRecordRow,
} from "@/types/probiotic-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, FileEditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, {
  type CellKeyDownArgs,
  type CellKeyboardEvent,
  type Column,
  type CopyEvent,
} from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const uploadResultSchema = baseUploadResultSchema.extend({
  timestamp: z.date({ required_error: "Timestamp is required" }),
});

type UploadResultData = z.infer<typeof uploadResultSchema>;

interface EditProbioticRecordDialogProps {
  probioticRecord: ProbioticRecordRow;
  probiotics: ProbioticRow[];
}

export function EditProbioticRecordDialog({
  probioticRecord,
  probiotics,
}: EditProbioticRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const probioticNames = useMemo(
    () => probiotics.map((probiotic) => probiotic.name),
    [probiotics]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<UploadResultData>({
    mode: "onChange",
    resolver: zodResolver(uploadResultSchema),
    values: {
      timestamp: probioticRecord.timestamp,
      fileList: null,
      note: probioticRecord.note,
    },
  });
  const { timestamp, fileList, note } = useWatch<UploadResultData>({ control });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const { rows, setRows, resetRows, exportFile } = useProbioticRecordResult(
    file,
    {
      initialResult: probioticRecord.result as ProbioticRecordResultEntry[],
    }
  );

  // REQUIREMENT: Try to infer timestamp from file name
  // HN1234 KP 20230630
  useEffect(() => {
    if (file) {
      const dateString = file.name.replace(/\.[^.]+$/, "").split(" ")[2];
      const date = parse(dateString, "yyyyMMdd", new Date());
      if (isValid(date)) {
        setValue("timestamp", date);
      }
    }
  }, [file, setValue]);

  const onSubmit = async () => {
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
      timestamp,
      result,
      note,
    };
    const postResponse = await fetch(
      `/api/probiotic-records/${probioticRecord.id}`,
      {
        method: "PUT",
        body: JSON.stringify(postReqBody),
      }
    );
    if (!postResponse.ok) return;

    const formData = new FormData();
    formData.append("file", file);

    const putResponse = await fetch(
      `/api/probiotic-records/${probioticRecord.id}/file`,
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

  useEffect(() => {
    if (!open) {
      reset();
      void resetRows();
    }
  }, [open, reset, resetRows]);

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

  const handleCopy = ({
    sourceRow,
    sourceColumnKey,
  }: CopyEvent<ProbioticRecordResultRow>) => {
    if (window.isSecureContext) {
      const text = sourceRow[sourceColumnKey as keyof ProbioticRecordResultRow];
      if (typeof text === "string") {
        void navigator.clipboard.writeText(text);
      }
    }
  };

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
                "bg-destructive text-destructive-foreground"
            )
          }
          renderers={{
            noRowsFallback: <NoRowsFallback />,
          }}
        />
      ),
    [loading, rows, columns, setRows, handleCellKeyDown, probioticNames]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-full w-full items-center justify-center">
          <FileEditIcon className="h-[18px] w-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:h-[90vh] sm:max-w-[576px]">
        <DialogTitle className="px-1">Edit probiotic record</DialogTitle>
        <div className="flex flex-col gap-4 overflow-auto p-1">
          <div className="flex gap-2">
            <Input
              id="file"
              type="file"
              className="flex-1"
              {...register("fileList")}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[30%] justify-start text-left font-normal",
                    !timestamp && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {timestamp ? (
                    format(timestamp, "yyyy-MM-dd")
                  ) : (
                    <span>Timestamp</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={timestamp}
                  onSelect={(day, selectedDay) =>
                    setValue("timestamp", selectedDay)
                  }
                />
              </PopoverContent>
            </Popover>
            <Button
              type="reset"
              variant="outline"
              onClick={() => {
                void resetRows();
                reset();
              }}
            >
              Reset
            </Button>
            <FormErrorTooltip
              message={
                errors.fileList
                  ? errors.fileList.message
                  : errors.timestamp
                  ? errors.timestamp.message
                  : undefined
              }
            />
          </div>
          {gridElement}
          <Input id="note" placeholder="Add notes..." {...register("note")} />
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
