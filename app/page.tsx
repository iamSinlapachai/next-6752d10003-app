import Image from "next/image";
import running from "../assets/images/running.png";
import Link from "next/link";

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
