"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import {
  MicroorganismEditor,
  refineMicroorganism,
} from "@/components/rdg/microorganism-editor";
import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import { ReadsEditor, refineReads } from "@/components/rdg/reads-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMicroorganismRecordRows } from "@/hooks/use-microorganism-record-rows";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { splitClipboard } from "@/lib/rdg";
import { uploadResultSchema as baseUploadResultSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { type MicroorganismRow } from "@/types/microorganism";
import { type MicroorganismRecordRow } from "@/types/microorganism-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { type VisitData } from "@prisma/client";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, Loader2Icon, PlusIcon } from "lucide-react";
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
import { z } from "zod";

const uploadResultSchema = baseUploadResultSchema.extend({
  collectionDate: z.date({ required_error: "Collection date is required" }),
});

type UploadResultData = z.infer<typeof uploadResultSchema>;

interface ImportAbundanceFileDialogProps {
  microorganisms: MicroorganismRow[];
  trigger?: JSX.Element;
}

export function ImportAbundanceFileDialog({
  microorganisms,
  trigger,
}: ImportAbundanceFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { patient } = useSelectPatientStore();

  const microorganismNames = useMemo(
    () => microorganisms.map((microorganism) => microorganism.name),
    [microorganisms]
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
    defaultValues: {
      fileList: null,
    },
  });
  const { collectionDate, fileList } = useWatch<UploadResultData>({
    control,
  });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const { rows, setRows, resetRows, exportFile } =
    useMicroorganismRecordRows(file);

  // REQUIREMENT: Try to infer collection date from file name
  // HN1234 KP 20230630
  useEffect(() => {
    if (file) {
      const detected = file.name.replace(/\.[^.]+$/, "").split(" ")[2];
      const date = parse(detected, "yyyyMMdd", new Date());
      if (isValid(date)) {
        setValue("collectionDate", date);
      }
    }
  }, [file, setValue]);

  const onSubmit = async () => {
    const session = await getSession();
    if (!session?.user || !patient?.id) return;
    const doctor = session.user;

    const file = exportFile();
    const microorganismRecords = rows
      .filter(
        (
          row
        ): row is {
          idx: number;
          microorganism: string;
          reads: string;
        } =>
          row.microorganism !== null &&
          row.reads !== null &&
          !Number.isNaN(parseFloat(row.reads))
      )
      .map((row) => ({
        microorganism: row.microorganism,
        reads: parseFloat(row.reads),
      }));

    const postReqBody = {
      doctorId: doctor.id,
      patientId: patient.id,
      collectionDate,
      microorganismRecords,
    };
    const postResponse = await fetch("/api/visit-datas", {
      method: "POST",
      body: JSON.stringify(postReqBody),
    });

    if (!postResponse.ok) return;
    const postResBody = (await postResponse.json()) as VisitData;
    const { id: visitDataId } = postResBody;

    const formData = new FormData();
    formData.append("file", file);

    const putResponse = await fetch(`/api/visit-datas/${visitDataId}/file`, {
      method: "PUT",
      body: formData,
    });
    if (!putResponse.ok) return;
    setOpen(false);
    router.refresh();
    reset();
  };

  // Component mounted
  useEffect(() => void setLoading(false), []);

  // Columns
  const columns = useMemo<Column<MicroorganismRecordRow>[]>(
    () => [
      {
        key: "microorganism",
        name: "Microorganism",
        minWidth: 416,
        maxWidth: 416,
        width: 416,
        renderEditCell: (p) => <MicroorganismEditor {...p} />,
      },
      {
        key: "reads",
        name: "Reads",
        minWidth: 90,
        maxWidth: 90,
        width: 90,
        renderEditCell: (p) => <ReadsEditor {...p} />,
      },
    ],
    []
  );

  const handleCopy = useCallback(
    ({ sourceRow, sourceColumnKey }: CopyEvent<MicroorganismRecordRow>) => {
      if (window.isSecureContext) {
        const text = sourceRow[sourceColumnKey as keyof MicroorganismRecordRow];
        if (typeof text === "string") {
          void navigator.clipboard.writeText(text);
        }
      }
    },
    []
  );

  const handleCellKeyDown = useCallback(
    (
      { row, column }: CellKeyDownArgs<MicroorganismRecordRow>,
      e: CellKeyboardEvent
    ) => {
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        void navigator.clipboard.readText().then((text) => {
          const pasted = splitClipboard(text);
          const newRows = [...rows];

          const replaceRows = pasted.map((result, idx) => {
            const newIdx = row.idx + idx;
            const microorganism = rows[newIdx]?.microorganism;
            const reads = rows[newIdx]?.reads;

            const newMicroorganism = result[-column.idx];
            const newValue = result[-column.idx + 1];

            return {
              idx: newIdx,
              microorganism: newMicroorganism
                ? refineMicroorganism(microorganism, newMicroorganism)
                : rows[newIdx]?.microorganism ?? null,
              reads: newValue
                ? refineReads(reads, newValue)
                : rows[newIdx]?.reads ?? null,
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
              row.microorganism !== null &&
                !microorganismNames.includes(row.microorganism) &&
                "bg-destructive text-destructive-foreground"
            )
          }
          renderers={{
            noRowsFallback: <NoRowsFallback />,
          }}
        />
      ),
    [
      loading,
      rows,
      columns,
      setRows,
      handleCopy,
      handleCellKeyDown,
      microorganismNames,
    ]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          setOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="h-10">
            <PlusIcon className="mr-2 h-4 w-4" />
            Import abundance file
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:h-[90vh] sm:max-w-[576px]">
        <DialogTitle className="px-1">Import abundance file</DialogTitle>
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
                    "w-[10rem] justify-start text-left font-normal",
                    !collectionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {collectionDate
                    ? format(collectionDate, "yyyy-MM-dd")
                    : "Collection date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={collectionDate}
                  onSelect={(day, selectedDay) =>
                    setValue("collectionDate", selectedDay)
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
                  : errors.collectionDate
                  ? errors.collectionDate.message
                  : undefined
              }
            />
          </div>
          {gridElement}
          <form
            className="flex justify-center"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
