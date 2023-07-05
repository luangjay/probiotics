import { SelectedPatient } from "@/components/selected-patient";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container flex h-screen gap-8 py-7">
      <section className="flex w-[18rem] flex-col justify-between gap-8 overflow-auto p-1">
        <Card className="flex-1">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:text-primary/90 hover:underline"
            >
              Home
            </Link>
            <Link
              href="/patients"
              className="text-primary underline-offset-4 hover:text-primary/90 hover:underline"
            >
              Patients
            </Link>
            <Link
              href="/probiotic-brands"
              className="text-primary underline-offset-4 hover:text-primary/90 hover:underline"
            >
              Probiotic brands
            </Link>
          </CardContent>
        </Card>
        <SelectedPatient />
      </section>
      <section className="flex-1 overflow-auto p-1">{children}</section>
    </div>
  );
}
