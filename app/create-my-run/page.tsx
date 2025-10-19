"use client";
import Image from "next/image";
import running from "../../assets/images/running.png"; // ตรวจสอบว่า path นี้ถูกต้อง
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { HiOutlineUpload } from "react-icons/hi"; // 1. Import ไอคอนสำหรับปุ่ม

export default function Page() {
  const [rundate, setRunDate] = useState("");
  const [rundistance, setRunDistance] = useState("");
  const [runplace, setRunPlace] = useState(""); // โค้ดเดิมมี state นี้ แต่ลืมใช้
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 2. เปลี่ยนค่าเริ่มต้นเป็น null

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!rundate.trim() || !rundistance.trim() || !runplace.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน: วันที่, ระยะทาง และ สถานที่");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const newFileName = `${Date.now()}_${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("myrun_bk") // ตรวจสอบว่า bucket "myrun_bk" มีอยู่จริง
        .upload(newFileName, imageFile);

      if (error) {
        alert("เกิดข้อผิดพลาดการอัพโหลดรูปภาพ");
        console.log("Error uploading image:", error.message);
        return;
      }

      const { data: urlData } = supabase.storage // แก้ไขการดึง URL
        .from("myrun_bk")
        .getPublicUrl(newFileName);

      imageUrl = urlData.publicUrl;
    }

    // 3. (แก้ไข Bug) เพิ่ม run_place เข้าไปใน object ที่จะ insert
    const { data, error } = await supabase.from("myrun_tb").insert({
      run_date: rundate,
      run_distance: parseFloat(rundistance) || 0, // แปลงเป็นตัวเลข
      run_place: runplace, // <-- เพิ่มฟิลด์นี้
      run_image_url: imageUrl,
    });

    if (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.log("Error uploading data:", error.message);
      return;
    }
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    window.location.href = "/show-all-myrun"; // ไปยังหน้าแสดงผล
  };

  return (
    // 4. (ปรับ UI) ห่อทั้งหมดด้วยพื้นหลังสีเทาอ่อนและจัดกลาง
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* การ์ดสีขาวสำหรับฟอร์ม */}
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        {/* ส่วนโลโก้และหัวข้อ */}
        <div className="flex flex-col items-center">
          <Image
            src={running}
            alt="running picture"
            width={70} // 5. (ปรับ UI) ลดขนาดโลโก้
            height={70}
            priority
          />
          <p className="mt-2 text-sm font-bold tracking-wider text-black">
            RUNNING
          </p>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            เพิ่มข้อมูลการวิ่งของฉัน
          </h1>
        </div>

        {/* 6. (ปรับ UI) ลบกล่อง "เพิ่มงานใหม่" ออก และใช้ form เป็นหลัก */}
        <form onSubmit={handleUploadAndSave} className="mt-8 space-y-5">
          {/* วันที่วิ่ง */}
          <div>
            <label
              htmlFor="rundate"
              className="block text-sm font-medium text-gray-700"
            >
              ป้อนวันที่วิ่ง
            </label>
            <input
              id="rundate"
              value={rundate}
              onChange={(e) => setRunDate(e.target.value)}
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ป้อนวันที่วิ่ง"
              required
            />
          </div>

          {/* ระยะทางที่วิ่ง */}
          <div>
            <label
              htmlFor="rundistance"
              className="block text-sm font-medium text-gray-700"
            >
              ระยะทางที่วิ่ง
            </label>
            {/* 7. (ปรับ UI) เปลี่ยนจาก textarea เป็น input */}
            <input
              id="rundistance"
              value={rundistance}
              onChange={(e) => setRunDistance(e.target.value)}
              type="number" // 8. (ปรับ UI) ใช้ type="number" จะเหมาะกว่า
              step="0.1" // อนุญาตให้ใส่ทศนิยม
              className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ระยะทางที่วิ่ง (เช่น 10.5)"
              required
            />
          </div>

          {/* 9. (ปรับ UI) เพิ่มฟิลด์ "สถานที่วิ่ง" ที่ขาดหายไป */}
          <div>
            <label
              htmlFor="runplace"
              className="block text-sm font-medium text-gray-700"
            >
              สถานที่วิ่ง
            </label>
            <input
              id="runplace"
              value={runplace}
              onChange={(e) => setRunPlace(e.target.value)}
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="สถานที่วิ่ง"
              required
            />
          </div>

          {/* 10. (แก้ไข imagePreview) แสดงรูปตัวอย่าง หรือ โลโก้ */}
          <div className="flex flex-col items-center">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={running}
                  alt="Placeholder"
                  width={80}
                  height={80}
                  className="opacity-50"
                />
              )}
            </div>
          </div>

          {/* ปุ่มเลือกไฟล์ */}
          <div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectImage} // 11. (แก้ไข) เพิ่ม onChange ตรงนี้
            />
            <label
              htmlFor="fileInput"
              // 12. (ปรับ UI) เปลี่ยนสีปุ่มเป็นสีเขียวและเพิ่มไอคอน
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              <HiOutlineUpload className="h-5 w-5" />
              SELECT FILE UPLOAD
            </label>
          </div>

          {/* ปุ่มบันทึก */}
          <div>
            <button
              type="submit"
              // 13. (ปรับ UI) เปลี่ยนสีปุ่มเป็นสีน้ำเงินเข้ม
              className="w-full rounded-md bg-blue-800 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900"
            >
              บันทึกการวิ่ง
            </button>
          </div>
        </form>

        {/* 14. (ปรับ UI) ปรับลิงก์ "กลับ" ให้เป็นสีแดง */}
        <Link
          href="/show-all-myrun"
          className="mt-5 block text-center text-red-600 hover:text-red-700 hover:underline"
        >
          กลับไปหน้าการวิ่งของฉัน
        </Link>
      </div>
    </main>
  );
}
