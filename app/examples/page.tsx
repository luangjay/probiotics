"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";

import { uploadFileSchema } from "@/lib/schema";
import { useJson } from "@/hooks/use-json";

type UploadFileData = z.infer<typeof uploadFileSchema>;

export default function UseJsonExample() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UploadFileData>({
    mode: "onChange",
    resolver: zodResolver(uploadFileSchema),
  });
  const fileList = useWatch<UploadFileData>({ control, name: "fileList" });
  const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
  const json = useJson(file);

  useEffect(() => {
    console.log(file);
  }, [file]);

  useEffect(() => {
    console.log(json);
  }, [json]);

  const onSubmit = async () => {};

  return (
    <div>
      <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
        <label htmlFor="file">abcd</label>
        <input id="file" type="file" {...register("fileList")}></input>
        <p className="text-destructive">{errors.fileList?.message}</p>
      </form>
    </div>
  );
}
