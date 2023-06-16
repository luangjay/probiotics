import { spec } from "@/lib/swagger";

import ReactSwagger from "./react-swagger";

export default function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
