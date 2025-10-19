import Image from "next/image";
import running from "../assets/images/running.png";
import Link from "next/link";

export default function Page() {
  return (
    // 1. Background (outer container)
    // Makes the whole page light gray and centers everything
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* 2. White Card (main box) */}
      {/* This is the white box with rounded corners and a shadow */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        {/* 3. Logo and Title */}
        <div className="flex flex-col items-center">
          {/* IMPORTANT: You need to add your logo image 
            to the /public folder (e.g., /public/running-logo.png)
          */}
          <Image
            src={running} // <-- Change this to your logo's file path
            alt="Running Logo"
            width={80} // You can change the size
            height={80} // You can change the size
            priority // Helps load the logo faster
          />
        </div>

        {/* 4. Welcome Text */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Welcome to MyRun
        </h1>

        {/* 5. Sub-text */}
        <p className="mt-4 text-base text-gray-600">
          Your personal running record.
        </p>
        <p className="mt-1 text-base text-gray-600">
          You can create and update your running record.
        </p>

        {/* 2. เปลี่ยนจาก <button> เป็น <Link> */}
        <Link
          href="/show-all-myrun" // 3. เพิ่ม href ที่คุณต้องการ
          className="
            mt-8 block w-full rounded-md bg-blue-600 px-6 py-3 
            text-center font-semibold text-white shadow-sm 
            transition-colors hover:bg-blue-700 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          " // 4. เราใช้ class เดิมเกือบทั้งหมด แต่เพิ่ม 'block' และ 'text-center'
        >
          เข้าสู่หน้าข้อมูลการวิ่งของฉัน
        </Link>
      </div>
    </main>
  );
}
/*
export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Image
          className="mt-20"
          src={running}
          alt="running picture"
          width={100}
        ></Image>

        <h1 className="mt-5 text-4xl font-bold text-blue-500">
          Welcome To My Run App
        </h1>

        <h3>Your personal running record</h3>
        <h3>You can create and updater your running record.</h3>
        <Link
          href="/show-all-myrun"
          className="mt-10 text-white bg-blue-600 hover:bg-blue-700
          px-20 py-3 rounded"
        >
          เข้าสู่หน้าข้อมูลการวิ่งของฉัน
        </Link>
      </div>
    </>
  );
}
*/
