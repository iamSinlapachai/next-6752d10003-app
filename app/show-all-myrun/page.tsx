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
      const { data, error } = await supabase
        .from("myrun_tb")
        .delete()
        .eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาด");
        console.log(error.message);
        return;
      }

      setMyruns(myruns.filter((myrun) => myrun.id !== id));
      alert("ลบข้อมูลเรียบร้อยแล้ว");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mt-10">
        {/* of top */}
        <Image
          className="mt-20"
          src={running}
          alt="running picture"
          width={120}
        ></Image>

        <h1 className="mt-8 py-10 text-2xl font-bold">การวิ่งของฉัน</h1>

        {/* show all the My runs */}

        <div className="flex  w-10/12 mt-5 ">
          <table className="w-full">
            {/* top */}
            <thead>
              <tr className="text-center border font-bold bg-blue-300">
                <td className="border p-2">No.</td>
                <td className="border p-2">วันที่วิ่ง</td>
                <td className="border p-2">รูปที่วิ่ง</td>
                <td className="border p-2">ระยะทางในการวิ่ง</td>
                <td className="border p-2">สถานที่วิ่ง</td>
                <td className="border p-2"> </td>
              </tr>
            </thead>

            {/* in table */}
            <tbody>
              {/* วนลูปข้อมูลที่อยู่ใน State:tasks มาแสดงทีละแถว */}
              {myruns.map((MyRuns, index) => (
                <tr key={MyRuns.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{MyRuns.run_date}</td>
                  <td className="border p-2">
                    {MyRuns.run_image_url ? (
                      <Image
                        className="mx-auto"
                        src={MyRuns.run_image_url}
                        alt="รูปการวิ่งของคุณ"
                        width={50}
                        height={50}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">{MyRuns.run_distance}</td>
                  <td className="border p-2">{MyRuns.run_place}</td>

                  <td className="border p-2 ">
                    <Link
                      href={"#"}
                      className="text-green-500 cursor-pointer hover:text-green-700 mr-2"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(MyRuns.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* button for add task */}
        <div className=" flex justify-center ">
          <Link
            href="/create-my-run"
            className="mt-5 text-white bg-blue-600 hover:bg-blue-700
          px-40 py-2 rounded"
          >
            เพิ่มงานใหม่
          </Link>
        </div>
      </div>
    </>
  );
}
