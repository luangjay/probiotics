import { getCsv } from "@/lib/utils";

export default async function Patient() {
  const s = await getCsv("probiotic-records", "clj5hku3q002n7qyys82ai3q5");
  return <div>{s}</div>;
}
