import Image from "next/image";
import Link from "next/link";

import running from "../assets/images/running.png";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <PageShell>
      <Card className="mx-auto max-w-lg text-center">
        <div className="flex flex-col items-center">
          <Image
            src={running}
            alt="Running logo"
            width={96}
            height={96}
            priority
            className="drop-shadow-sm"
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            MyRun
          </p>
        </div>

        <div className="mt-6 space-y-4 text-slate-600">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to MyRun</h1>
          <p>Your personal running record.</p>
          <p>Track every run, stay motivated, and celebrate your progress.</p>
        </div>

        <Link
          href="/show-all-myrun"
          className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
        >
          เข้าสู่หน้าข้อมูลการวิ่งของฉัน
        </Link>
      </Card>
    </PageShell>
  );
}
