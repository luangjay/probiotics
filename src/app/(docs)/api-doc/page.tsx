import { getApiDocs } from "@/lib/swagger";

import ReactSwagger from "./react-swagger";

export default function IndexPage() {
  const spec = getApiDocs();
  return (
    <section className="container border border-red-500">
      <ReactSwagger spec={spec} />
    </section>
  );
}
