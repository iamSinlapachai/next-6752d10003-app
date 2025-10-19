"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import running from "../../assets/images/running.png";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "../../lib/supabaseClient";

type MyRun = {
  id: string;
  created_at: string;
  run_date: string;
  run_distance: number;
  run_place: string;
  run_image_url: string | null;
};

export default function Page() {
  const [myRuns, setMyRuns] = useState<MyRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyRuns = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("myrun_tb")
      .select("id, created_at, run_date, run_distance, run_place, run_image_url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching myruns:", error.message);
      setMyRuns([]);
    } else {
      setMyRuns((data ?? []) as MyRun[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMyRuns();
  }, [fetchMyRuns]);

  const handleDeleteClick = async (id: string) => {
    const isConfirmed = window.confirm("แน่ใจว่าจะลบงานนี้หรือไม่");
    if (!isConfirmed) return;

    setDeletingId(id);

    try {
      const { error } = await supabase.from("myrun_tb").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setMyRuns((previous) => previous.filter((run) => run.id !== id));
    } catch (error) {
      console.error("Error deleting run:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeletingId(null);
    }
  };

  const hasRuns = myRuns.length > 0;

  return (
    <PageShell align="start">
      <Card className="mx-auto mt-10 max-w-6xl">
        <header className="flex flex-col gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
            <Image
              src={running}
              alt="Running logo"
              width={80}
              height={80}
              priority
              className="drop-shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
                My Runs
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">การวิ่งของฉัน</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                ติดตามบันทึกการวิ่งทั้งหมดของคุณ พร้อมจัดการข้อมูลอย่างง่ายดายไม่ว่าจะอยู่ที่หน้าจอขนาดใด
              </p>
            </div>
          </div>

          <Link
            href="/create-my-run"
            className={cn(
              buttonVariants({ variant: "primary", fullWidth: false, size: "md" }),
              "self-center sm:self-start"
            )}
          >
            เพิ่มข้อมูลการวิ่งของฉัน
          </Link>
        </header>

        <section className="mt-10">
          {loading ? (
            <div className="flex justify-center rounded-xl border border-dashed border-slate-200 px-6 py-16 text-sm text-slate-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : !hasRuns ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center text-sm text-slate-500">
              <p>ยังไม่มีข้อมูลการวิ่ง</p>
              <Link
                href="/create-my-run"
                className={buttonVariants({ variant: "primary", fullWidth: false, size: "sm" })}
              >
                เพิ่มข้อมูลครั้งแรก
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-900">
                      <tr className="text-left text-sm font-semibold text-white">
                        <th scope="col" className="px-4 py-3 text-center">
                          ลำดับ
                        </th>
                        <th scope="col" className="px-4 py-3">
                          วันที่วิ่ง
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          รูปที่วิ่ง
                        </th>
                        <th scope="col" className="px-4 py-3">
                          ระยะทาง (กม.)
                        </th>
                        <th scope="col" className="px-4 py-3">
                          สถานที่วิ่ง
                        </th>
                        <th scope="col" className="px-4 py-3 text-right">
                          การจัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {myRuns.map((run, index) => (
                        <tr key={run.id} className="text-sm text-slate-700">
                          <td className="px-4 py-3 text-center font-medium text-slate-600">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {run.run_date}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {run.run_image_url ? (
                              <Image
                                src={run.run_image_url}
                                alt={`รูปการวิ่งของฉัน #${index + 1}`}
                                width={48}
                                height={48}
                                className="mx-auto h-12 w-12 rounded-full object-cover shadow-sm"
                                unoptimized
                              />
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium">{run.run_distance}</td>
                          <td className="px-4 py-3">{run.run_place}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                href={`/edit-my-run/${run.id}`}
                                className={
                                  buttonVariants({ variant: "link", fullWidth: false, size: "sm" })
                                }
                              >
                                แก้ไข
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(run.id)}
                                className={
                                  buttonVariants({ variant: "danger", fullWidth: false, size: "sm" })
                                }
                                disabled={deletingId === run.id}
                              >
                                {deletingId === run.id ? "กำลังลบ..." : "ลบ"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4 md:hidden">
                {myRuns.map((run, index) => (
                  <article
                    key={run.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                        {run.run_image_url ? (
                          <Image
                            src={run.run_image_url}
                            alt={`รูปการวิ่งของฉัน #${index + 1}`}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={running}
                            alt="Running logo"
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                          Run #{index + 1}
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                          {run.run_place}
                        </h2>
                        <p className="text-sm text-slate-500">{run.run_date}</p>
                      </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <dt className="font-medium text-slate-500">ระยะทาง</dt>
                        <dd className="mt-1 text-lg font-semibold text-slate-900">
                          {run.run_distance} กม.
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">วันที่วิ่ง</dt>
                        <dd className="mt-1 text-sm text-slate-900">{run.run_date}</dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/edit-my-run/${run.id}`}
                        className={
                          buttonVariants({ variant: "link", fullWidth: false, size: "sm" })
                        }
                      >
                        แก้ไข
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(run.id)}
                        className={
                          buttonVariants({ variant: "danger", fullWidth: false, size: "sm" })
                        }
                        disabled={deletingId === run.id}
                      >
                        {deletingId === run.id ? "กำลังลบ..." : "ลบ"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </Card>
    </PageShell>
  );
}
