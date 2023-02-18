import LogButton from "../components/buttons/logButton";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Home() {
  const test = () => {
    console.log("TEST");
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex h-[70vh] justify-center items-center">
        <div className="text-center flex flex-col align-middle">
          <Link
            className="bg-primary text-2xl py-3 px-4 rounded-xl m-4 hover:bg-[#141466]"
            href="/create"
          >
            CREATE ROOM
          </Link>
          <Link
            className="bg-primary text-2xl py-3 px-4 rounded-xl m-4"
            href="/join"
          >
            JOIN ROOM
          </Link>
        </div>
      </div>
    </div>
  );
}
