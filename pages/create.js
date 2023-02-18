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
      setFisrtName(fn[0]);
      setRoomName(`${firstName}'s room`);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <b>
          <div className="text-5xl flex justify-center my-10 text-primary">
            Create Room
          </div>
        </b>

        <div
          id="form"
          className=" min-h-[40vh] min-w-[3vh] m-7 mt-18 select-none"
        >
          <div className="mb-7">
            <label className="block mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              ROOM NAME
            </label>
            <input
              type={"text"}
              id="email"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                console.log(roomName);
              }}
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryD dark:focus:border-primaryD"
            ></input>
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white font-semibold text-lg">
              PLAYER COUNT
            </label>
            <div className=" flex justify-center mb-5 items-center ">
              <p className="text-xl font-semibold m-2 text-primary">3</p>
              <input
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                type={"range"}
                min={3}
                max={8}
                value={players}
                step={1}
                onChange={changePlayers}
              />
              <p className="text-xl m-2 font-semibold text-primary ">8</p>
            </div>
          </div>
          <div>
            <label className="block mb-4  font-semibold text-gray-900 dark:text-white text-lg">
              ROUND TIMER
            </label>
            <div className=" flex justify-center items-center select-none ">
              <ul className="grid w-[95%] gap-6 grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
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
                    className="inline-flex align-middle items-center justify-center w-full p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                    className="inline-flex items-center justify-center w-full p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                    className="inline-flex items-center justify-center w-full p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
        <button
          className="px-5 py-4 bg-primary dark:bg-primaryD rounded-2xl font-semibold"
          onClick={createRoom}
        >
          CREATE
        </button>
      </div>
    </div>
  );
}

export default Create;
