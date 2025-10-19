"use client";

import Image from "next/image";
import running from "../../assets/images/running.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// สร้างประเภทข้อมูลแบบ interface
type MyRuns = {
  id: string;
  created_at: string;
  run_date: string;
  run_distance: number;
  run_place: string;
  run_image_url: string;
};

export default function Page() {
  // สร้างตัวแปร state สำหรับเก็บรายการงานทั้งหมด
  const [myruns, setMyruns] = useState<MyRuns[]>([]);
  const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับสถานะ loading

  useEffect(() => {
    const fetchMyRuns = async () => {
      setLoading(true); // เริ่มโหลด
      const { data, error } = await supabase
        .from("myrun_tb")
        .select(
          "id, created_at, run_date, run_distance, run_place, run_image_url"
        )
        .order("created_at", { ascending: false });

      if (error) {
        // alert("เกิดข้อผิดพลาดในการดึงข้อมูล: " + error.message); // อาจจะใช้ alert นี้แทน
        console.error("Error fetching myruns:", error.message);
        // สามารถตั้งค่า myruns เป็น [] หรือแสดงข้อความผิดพลาดใน UI ได้
      } else if (data) {
        setMyruns(data as MyRuns[]);
      }
      setLoading(false); // โหลดเสร็จสิ้น
    };
    fetchMyRuns();
  }, []);

  useEffect(() => {
    const fetchMyRuns = async () => {
      const { data, error } = await supabase
        .from("myrun_tb")
        .select(
          "id, created_at, run_date, run_distance, run_place, run_image_url" // of .select("*")
        )
        .order("created_at", { ascending: false });
      if (error) {
        alert("เกิดข้อผิดพลาด");
        console.log("Error fetching myruns:", error.message);
        return;
      }
      if (data) {
        setMyruns(data as MyRuns[]);
      }
    };
    fetchMyRuns();
  }, []);

  // สร้างฟังชัน เพื่อควบคุมปุ่มลบ
  const handleDeleteClick = async (id: string) => {
    // ก่อนลบให้ถามยืนยันผู้ใช้
    if (confirm("แน่ใจว่าจะลบงานนี้หรือไม่")) {
      const { error } = await supabase.from("myrun_tb").delete().eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาด...");
        console.log(error.message);
        return;
      }

      setMyruns((previous) => previous.filter((myrun) => myrun.id !== id));
      alert("ลบข้อมูลเรียบร้อยแล้ว");
    }
  };

  return (
    // Outer container for centering and light gray background
    <div className="flex min-h-screen items-start justify-center bg-gray-100 p-4">
      {/* White card container for all content */}
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md mt-10">
        {" "}
        {/* max-w-4xl เพื่อให้กว้างขึ้น */}
        {/* Top Section: Logo and Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src={running}
            alt="running picture"
            width={70} // ปรับขนาดโลโก้ให้เล็กลง
            height={70}
            priority
          />

          <h1 className="mt-6 text-2xl font-bold text-gray-800">
            การวิ่งของฉัน
          </h1>
        </div>
        {/* My Runs Table */}
        <div className="overflow-x-auto">
          {" "}
          {/* เพิ่ม overflow-x-auto สำหรับตารางบนมือถือ */}
          <table className="w-full border-collapse">
            {" "}
            {/* ใช้ border-collapse เพื่อให้เส้นขอบชนกัน */}
            <thead>
              <tr className="bg-gray-700 text-white">
                {" "}
                {/* เปลี่ยนสีหัวตารางและตัวอักษร */}
                <td className="p-3 text-center border-r border-gray-600">
                  No.
                </td>
                <td className="p-3 text-center border-r border-gray-600">
                  วันที่วิ่ง
                </td>
                <td className="p-3 text-center border-r border-gray-600">
                  รูปที่วิ่ง
                </td>
                <td className="p-3 text-center border-r border-gray-600">
                  ระยะทางในการวิ่ง
                </td>
                <td className="p-3 text-center border-r border-gray-600">
                  สถานที่วิ่ง
                </td>
                <td className="p-3 text-center"></td>{" "}
                {/* สำหรับปุ่ม แก้ไข/ลบ */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : myruns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    ยังไม่มีข้อมูลการวิ่ง
                  </td>
                </tr>
              ) : (
                myruns.map((myrun, index) => (
                  <tr
                    key={myrun.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{myrun.run_date}</td>
                    <td className="p-3 text-center">
                      {myrun.run_image_url ? (
                        <Image
                          className="mx-auto rounded-full object-cover" // เพิ่ม rounded-full และ object-cover
                          src={myrun.run_image_url}
                          alt={`รูปการวิ่งของฉัน #${index + 1}`}
                          width={40} // ลดขนาดรูปภาพในตาราง
                          height={40}
                          unoptimized
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 text-center">{myrun.run_distance}</td>
                    <td className="p-3 text-center">{myrun.run_place}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {" "}
                      {/* เพิ่ม whitespace-nowrap กันปุ่มตกบรรทัด */}
                      <Link
                        href={`/edit-my-run/${myrun.id}`} // สมมติว่าหน้าแก้ไขใช้ id ใน URL
                        className="text-blue-600 cursor-pointer hover:underline mr-4" // เปลี่ยนเป็นสีน้ำเงินตามภาพ
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(myrun.id)}
                        className="text-red-600 cursor-pointer hover:underline"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Add New Run Button */}
        <div className="mt-8">
          {" "}
          {/* ปรับระยะห่างด้านบน */}
          <Link
            href="/create-my-run"
            className="block w-full bg-blue-700 text-white py-3 px-6 rounded-md 
                       text-center font-semibold text-lg hover:bg-blue-800 
                       transition-colors shadow-lg" // ปรับขนาดข้อความและเงา
          >
            เพิ่มข้อมูลการวิ่งของฉัน
          </Link>
        </div>
      </div>
    </div>
  );
}
