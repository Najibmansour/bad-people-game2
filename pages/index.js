import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoginDiv from "../components/login";
import { app } from "../firebase-config";
import { getAuth } from "firebase/auth";

export default function Home() {
  const auth = getAuth();
  const [token, setToken] = useState();
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user !== null) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [user]);

  return (
    <div>
      <Navbar>
        <LoginDiv />
      </Navbar>
      <div className="flex h-[70vh] justify-center items-center">
        <div className="text-center flex flex-col align-middle">
          <button
            className={
              token ? "btn btn-lg mb-8" : "btn btn-lg btn-disabled mb-8 "
            }
            onClick={() => {
              router.push("/create");
            }}
          >
            CREATE ROOM
          </button>
          <button
            className={
              token ? "btn btn-lg mb-8" : "btn btn-lg btn-disabled mb-8 "
            }
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
