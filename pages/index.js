import LogButton from "../components/buttons/logButton";
import Navbar from "../components/navbar";
import Link from "next/link";
import { Theme, Button } from "daisyui";
import { useRouter } from "next/router";

export default function Home() {
  const test = () => {
    console.log("TEST");
  };

  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div className="flex h-[70vh] justify-center items-center">
        <div className="text-center flex flex-col align-middle">
          <button
            className="btn btn-lg mb-8 "
            onClick={() => {
              router.push("/create");
            }}
          >
            CREATE ROOM
          </button>
          <button
            className="btn btn-lg mb-8"
            onClick={() => {
              router.push("/create");
            }}
          >
            JOIN ROOM
          </button>
        </div>
      </div>
    </div>
  );
}
