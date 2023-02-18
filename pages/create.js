import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
//  FIREBASE FIRESTORE
import { database, app } from "../firebase-config";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
// DATA FETCHING FROM LOCAL_STORAGE
import { userAccessToken } from "../utils/fetchUserAccessToken";
import { fetchUserData } from "../utils/fetchUserData";
import { useRouter } from "next/router";

function Create() {
  const router = useRouter();
  const [firstName, setFisrtName] = useState("");
  // ROOM CONFIG //////////
  const [players, setPlayers] = useState(3);
  const [timeInSec, setTimeInSec] = useState(20);
  const [roomName, setRoomName] = useState("");

  /////////////////////////
  // DATABASE SHIT ////////
  const collectionRef = collection(database, "room");
  /////////////////////////

  const createRoom = async () => {
    const roomConfig = {
      maxPlayers: players,
      roomNum: "",
      players: [],
    };
    const result = await getDocs(collectionRef);
    console.log(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  function changePlayers(e) {
    setPlayers(e.target.value);
  }

  function changePlayers(e) {
    setPlayers(e.target.value);
  }
  function changeTime(e) {
    setTimeInSec(e.target.value);
    console.log(timeInSec);
  }

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) {
      router.push("/");
    } else {
      const userData = fetchUserData();
      const name = userData[0].displayName;
      const fn = name.split(" ");
      setRoomName(`${fn[0]}'s room`);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <b>
          <div className="text-4xl flex justify-center my-10 text-primary">
            CREATE ROOM
          </div>
        </b>

        <div
          id="form"
          className=" min-h-[40vh] min-w-[3vh] m-7 mt-18 select-none lg:min-h-[40vh] lg:min-w-[3vh] "
        >
          <div className="form-control w-full max-w-xs">
            <label className="label">ROOM NAME</label>
            <input
              type={"text"}
              id="email"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                console.log(roomName);
              }}
              className="input input-bordered input-primary w-full max-w-xs bg-base-200"
            ></input>
          </div>
          <label className="label mt-6">PLAYER COUNT</label>

          <input
            type="range"
            min="3"
            max="8"
            className="range range-primary"
            value={players}
            step={1}
            onChange={changePlayers}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <div className="flex-col flex items-center">
              <span>|</span>
              <p className="text-sm ">3</p>
            </div>

            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <div className="flex-col flex items-center">
              <span>|</span>
              <p className="text-sm ">8</p>
            </div>
          </div>
          <div>
            <label className="label">ROUND TIMER</label>
            <div className=" flex justify-center items-center select-none ">
              <ul className="flex justify-center items-center gap-10">
                <li>
                  <input
                    type="radio"
                    id="time-2"
                    name="timeInSec"
                    value={20}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-2"
                    className="btn btn-outline btn-primary"
                  >
                    <div className="block ">
                      <div className="w-full text-xl font-semibold">20</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="time-1"
                    name="timeInSec"
                    value={45}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-1"
                    className="btn btn-outline btn-primary"
                  >
                    <div className="block">
                      <div className="w-full text-xl font-semibold">45</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="time-3"
                    name="timeInSec"
                    value={60}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-3"
                    className="btn btn-outline btn-primary"
                  >
                    <div className="block">
                      <div className="w-full text-xl font-semibold">60</div>
                    </div>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-primary btn-lg" onClick={createRoom}>
          CREATE
        </button>
      </div>
    </div>
  );
}

export default Create;
