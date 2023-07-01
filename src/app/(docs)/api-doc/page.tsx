import { spec } from "@/lib/swagger";
import Swagger from "./swagger";

export default function IndexPage() {
  return (
    <section className="container">
      <Swagger spec={spec} />
    </section>
  );
}
