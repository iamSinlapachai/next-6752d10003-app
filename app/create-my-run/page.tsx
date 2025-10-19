"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";

import running from "../../assets/images/running.png";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "../../lib/supabaseClient";

export default function Page() {
  const router = useRouter();
  const [runDate, setRunDate] = useState("");
  const [runDistance, setRunDistance] = useState("");
  const [runPlace, setRunPlace] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUploadAndSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const newFileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("myrun_bk")
          .upload(newFileName, imageFile, {
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("myrun_bk")
          .getPublicUrl(newFileName);

        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("myrun_tb").insert({
        run_date: runDate,
        run_distance: parseFloat(runDistance) || 0,
        run_place: runPlace,
        run_image_url: imageUrl,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      await router.push("/show-all-myrun");
    } catch (error) {
      console.error("Error saving run", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <Card className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src={running}
            alt="Running logo"
            width={88}
            height={88}
            priority
            className="drop-shadow-sm"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
            Add Run
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            เพิ่มข้อมูลการวิ่งของฉัน
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            บันทึกวันที่ ระยะทาง สถานที่ และรูปภาพเพื่อเก็บเป็นความทรงจำที่ดีของคุณ
          </p>
        </div>

        <form onSubmit={handleUploadAndSave} className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label
                htmlFor="runDate"
                className="block text-sm font-medium text-slate-700"
              >
                วันที่วิ่ง
              </label>
              <input
                id="runDate"
                value={runDate}
                onChange={(event) => setRunDate(event.target.value)}
                type="date"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="runDistance"
                className="block text-sm font-medium text-slate-700"
              >
                ระยะทาง (กิโลเมตร)
              </label>
              <input
                id="runDistance"
                value={runDistance}
                onChange={(event) => setRunDistance(event.target.value)}
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="เช่น 5.4"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="runPlace"
                className="block text-sm font-medium text-slate-700"
              >
                สถานที่วิ่ง
              </label>
              <input
                id="runPlace"
                value={runPlace}
                onChange={(event) => setRunPlace(event.target.value)}
                type="text"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="สวนสาธารณะ สนามกีฬา หรือสถานที่อื่น"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
            <div className="flex items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={running}
                    alt="Placeholder"
                    width={64}
                    height={64}
                    className="opacity-50"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
              <label
                htmlFor="fileInput"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    fullWidth: false,
                    size: "sm",
                  }),
                  "cursor-pointer"
                )}
              >
                <HiOutlineUpload className="h-5 w-5" />
                เลือกไฟล์รูปภาพ
              </label>
              <p className="text-xs text-slate-500">
                รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB เพื่อให้รูปแสดงผลได้ดีที่สุด
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={buttonVariants({ variant: "primary" })}
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกการวิ่ง"}
          </button>
        </form>

        <Link
          href="/show-all-myrun"
          className="mt-6 block text-center text-sm font-semibold text-red-600 transition hover:text-red-700 hover:underline"
        >
          กลับไปหน้าการวิ่งของฉัน
        </Link>
      </Card>
    </PageShell>
  );
}
