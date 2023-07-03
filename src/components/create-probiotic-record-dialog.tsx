"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useProbioticRecordResults } from "@/hooks/use-probiotic-record-results";
import { uploadSheetSchema } from "@/lib/schema";
import { type ProbioticRecordResult } from "@/types/probiotic-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";

type UploadFileData = z.infer<typeof uploadSheetSchema>;

export function CreateProbioticRecordDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UploadFileData>({
    mode: "onChange",
    resolver: zodResolver(uploadSheetSchema),
  });
  const fileList = useWatch<UploadFileData>({ control, name: "fileList" });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const { results } = useProbioticRecordResults(file);

  // Component mounted
  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, [results]);

  useEffect(() => void console.log(file), [file]);

  useEffect(() => void console.log(results), [results]);

  // Columns
  const columns = useMemo<Column<ProbioticRecordResult>[]>(
    () => [
      {
        key: "probiotic",
        name: "Probiotic",
        width: "80%",
      },
      {
        key: "value",
        name: "Value",
        width: "20%",
      },
    ],
    []
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="mx-1 flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1"
          // style={{ gridTemplateColumns: "1fr auto 1fr" }}
          rows={results}
          columns={columns}
          headerRowHeight={40}
          rowHeight={40}
          // rowKeyGetter={(row) => row.probiotic}
          renderers={{
            noRowsFallback: (
              <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, results, columns]
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost">New probiotic record</Button>
      </Dialog.Trigger>
      <Dialog.Content className="h-[90vh]">
        <Dialog.Title>New probiotic record</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description>
        <form className="flex flex-col gap-4 overflow-auto">
          <Input id="file" type="file" {...register("fileList")}></Input>
          <p className="text-destructive">{errors.fileList?.message}</p>
          {gridElement}
          <div className="flex justify-center">
            {/* <Dialog.Close asChild> */}
            <Button type="submit" disabled={false}>
              {false && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
            {/* </Dialog.Close> */}
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
