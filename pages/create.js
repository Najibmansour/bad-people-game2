import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { database } from "../firebase-config";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { fetchUserAccessToken } from "../utils/fetchUserAccessToken";
import { fetchUserData } from "../utils/fetchUserData";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/loadingSpinner";
import Modal from "../components/modal";

function Create() {
  const router = useRouter();
  const [modal, setModal] = useState([false, "", ""]);
  // ROOM CONFIG //////////
  const [players, setPlayers] = useState(7);
  const [questions, setQuestions] = useState(10);

  const [timeInSec, setTimeInSec] = useState(20);
  const [roomName, setRoomName] = useState("");
  // DATABASE SHIT ////////
  const [LOADING, setLOADING] = useState(false);
  /////////////////////////

  const createRoom = async () => {
    setLOADING(true);
    const user = fetchUserData();
    const uid = user[0].uid;
    const roomRef = doc(database, "room", `${uid}`);
    const answ = new Object();
    const quest = genQuestionsArray(questions);

    for (var i = 0; i < quest.length; i++) {
      answ[i] = [];
    }

    const roomData = {
      state: 0, //state 0:created 1:started 11:start, 2:end, 22:ended
      owner: uid,
      maxPlayers: parseInt(players),
      roomName: `${roomName}`,
      questions: quest,
      questionsTime: [],
      answers: answ,
      players: [],
      createDate: Timestamp.fromMillis(Date.now()),
      roundTime: parseInt(timeInSec),
    };
    console.table(roomData);

    setDoc(roomRef, roomData);
    setLOADING(false);
    setModal([
      true,
      "DONE!",
      'Your room is now ready! Invite your "friends"!',
      uid,
    ]);
  };

  const genQuestionsArray = (questNum) => {
    const arr = [];

    for (let i = 0; i < questNum; i++) {
      arr.push(
        Math.floor(
          Math.random() * (Math.floor(159) - Math.ceil(0)) + Math.ceil(0)
        )
      );
    }
    return arr;
  };

  function changePlayers(e) {
    setPlayers(e.target.value);
  }

  function changeQuestions(e) {
    setQuestions(e.target.value);
  }

  function changeTime(e) {
    setTimeInSec(e.target.value);
  }

  useEffect(() => {
    const accessToken = fetchUserAccessToken();
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
              }}
              className="input input-bordered input-primary w-full max-w-xs bg-base-200"
            ></input>
          </div>
          <div>
            <label className="label mt-3">PLAYER COUNT</label>

            <input
              type="range"
              min="3"
              max="9"
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
              <div className="flex-col flex items-center">
                <span>|</span>
                <p className="text-xs ">6</p>
              </div>
              <span>|</span>
              <span>|</span>
              <div className="flex-col flex items-center">
                <span>|</span>
                <p className="text-sm ">9</p>
              </div>
            </div>
          </div>
          <div>
            <label className="label mt-1">QUESTIONS COUNT</label>

            <input
              type="range"
              min="5"
              max="15"
              className="range range-primary"
              value={questions}
              step={1}
              onChange={changeQuestions}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <div className="flex-col flex items-center">
                <span>|</span>
                <p className="text-sm ">5</p>
              </div>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <div className="flex-col flex items-center">
                <span>|</span>
                <p className="text-xs ">10</p>
              </div>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <div className="flex-col flex items-center">
                <span>|</span>
                <p className="text-sm ">15</p>
              </div>
            </div>
          </div>
          <div>
            <label className="label">ROUND TIMER</label>
            <div className=" flex justify-center items-center select-none ">
              <ul className="flex justify-center items-center gap-10">
                <li>
                  <input
                    type="radio"
                    id="time-1"
                    name="timeInSec"
                    value={10}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-1"
                    className={
                      timeInSec == 10
                        ? "btn btn-primary"
                        : "btn btn-outline btn-primary"
                    }
                  >
                    <div className="block ">
                      <div className="w-full text-xl font-semibold">10s</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="time-2"
                    name="timeInSec"
                    value={15}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-2"
                    className={
                      timeInSec == 15
                        ? "btn btn-primary"
                        : "btn btn-outline btn-primary"
                    }
                  >
                    <div className="block">
                      <div className="w-full text-xl font-semibold">15s</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="time-3"
                    name="timeInSec"
                    value={20}
                    onChange={changeTime}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="time-3"
                    className={
                      timeInSec == 20
                        ? "btn btn-primary"
                        : "btn btn-outline btn-primary"
                    }
                  >
                    <div className="block">
                      <div className="w-full text-xl font-semibold">20s</div>
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
          className={
            LOADING
              ? "btn btn-primary btn-lg w-32 btn-disabled "
              : "btn btn-primary btn-lg w-32"
          }
          onClick={createRoom}
        >
          {LOADING ? <LoadingSpinner size={8} /> : <p>CREATE</p>}
        </button>
      </div>
      <Modal
        text={modal[2]}
        title={modal[1]}
        isEnabled={modal[0]}
        roomId={modal[3]}
      ></Modal>
    </div>
  );
}

export default Create;
