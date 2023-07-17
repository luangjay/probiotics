import { Swagger } from "@/components/swagger";
import { spec } from "@/lib/swagger";

export default function Page() {
  return (
    <section className="container">
      <Swagger spec={spec} />
    </section>
  );
}
