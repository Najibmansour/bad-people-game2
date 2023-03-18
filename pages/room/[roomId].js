import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  arrayUnion,
  onSnapshot,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ChoseAvatar from "../../components/chooseAvatar";
import { firebase, database } from "../../firebase-config";
import { fetchUserData } from "../../utils/fetchUserData";
import AVAfat from "../../public/avatars/fat.webp";
import AVAalcoholic from "../../public/avatars/alcoholic.webp";
import AVAbong from "../../public/avatars/bong.webp";
import AVAcats from "../../public/avatars/cats.webp";
import AVAcreep from "../../public/avatars/creep.webp";
import AVAgangster from "../../public/avatars/gangster.webp";
import AVAgolddigger from "../../public/avatars/golddigger.webp";
import AVAkidnapper from "../../public/avatars/kidnapper.webp";
import AVApedo from "../../public/avatars/pedo.webp";
import AVAwaiter from "../../public/avatars/waiter.webp";
import LoadingSpinner from "../../components/loadingSpinner";
import { fetchUserAccessToken } from "../../utils/fetchUserAccessToken";
import { ThemeSwitcher } from "../../components/themeSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

const questions = require("../../public/questions.json");

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomsCollectionRef = collection(database, "room");

  const [user, loading, error] = useAuthState(getAuth());
  const [canSelect, setCanSelect] = useState(false);

  const [roomSnapshot, setRoomSnapshot] = useState();
  const roomRef = doc(database, "room", `${roomId}`);

  const [avatarId, setAvatarId] = useState(0);
  const [vote, setVote] = useState(0);
  const [question, setQuestion] = useState(
    "If a dog chews shoes whose shoes does he choose?"
  );
  const [counter, setCounter] = useState(0);

  const useUnload = (fn) => {
    const cb = React.useRef(fn);

    React.useEffect(() => {
      const onUnload = cb.current;
      window.addEventListener("beforeunload", onUnload);
      return () => {
        window.removeEventListener("beforeunload", onUnload);
      };
    }, [cb]);
  };

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    const indexes = [];
    const accessToken = fetchUserAccessToken();
    if (!accessToken) {
      router.push("/");
    } else {
      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          setRoomSnapshot(doc.data());
          const index = doc
            .data()
            .players.findIndex(
              (player) => player.uid == user.providerData[0].uid
            );
          index == -1 ? setCanSelect(true) : null;
        });
      });
      return unsub;
    }
  }, [router.isReady, user]);

  const delPlayer = () => {
    const user = fetchUserData();

    const existingPlayer = {
      uid: `${user[0].uid}`,
      name: `${user[0].displayName}`,
      avatarID: avatarId,
    };
    updateDoc(roomRef, {
      players: arrayRemove(existingPlayer),
    });
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  };

  const addPlayer = (roomSnapshot) => {
    const user = fetchUserData();
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      const newPlayer = {
        uid: `${user[0].uid}`,
        name: `${user[0].displayName}`,
        avatarID: avatarId,
      };
      updateDoc(roomRef, {
        players: arrayUnion(newPlayer),
      });
    } else {
      console.log("room is full"); // @DEV add modal if room is full
    }
  };

  const submitAvatar = () => {
    console.log(roomSnapshot);
    addPlayer(roomSnapshot);
  };

  const addTest = () => {
    // console.log();

    const uid = Date.now();
    const newPlayer = {
      uid: `${uid}`,
      name: `TEST PLAYER`,
      avatarID: "5",
    };
    updateDoc(roomRef, {
      players: arrayUnion(newPlayer),
    });
  };

  const images = [
    AVAalcoholic,
    AVAbong,
    AVAcats,
    AVAcreep,
    AVAfat,
    AVAgangster,
    AVAgolddigger,
    AVAkidnapper,
    AVApedo,
    AVAwaiter,
  ];

  function changeVote(e) {
    setVote(e.target.value);
    console.log(vote);
  }

  function startGame() {
    const roundTime = roomSnapshot.roundTime;
    const date = new Date();
    const startTime = date.setSeconds(date.getSeconds() + 5);
    const questionTimeArray = [];
    for (let i = 0; i < roomSnapshot.questions.length; i++) {
      questionTimeArray.push(
        date.setSeconds(date.getSeconds() + 5 + roundTime * i)
      );
    }
    console.log(questionTimeArray);
  }

  function counterTimer() {
    setCounter(counter + 1);
  }

  const counterAnimation = {
    hidden: {
      y: "-100vh",
      zIndex: 999999,
      opacity: 0.1,
      transition: {
        duration: 0.4,
      },
    },
    visible: {
      y: "0",
      zIndex: 999999,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0.1,
      zIndex: 999999,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div>
      {roomSnapshot ? (
        <>
          <div className="mx-3 mt-3 flex justify-between">
            <p className="card-title">{roomSnapshot.roomName}</p>
            {roomSnapshot.owner == user.providerData[0].uid && (
              <button onClick={counterTimer} className="btn btn-primary">
                start
              </button>
            )}
          </div>

          <div className="flex justify-center  w-[100vw] h-[200vh] modal-open z-9999">
            <AnimatePresence>
              <motion.div
                key={counter}
                variants={counterAnimation}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-6xl text-warning font-mono fixed  mt-[40vh]"
              >
                {counter}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="m-1 justify-end absolute bottom-0">
            {canSelect ? (
              <div>
                <ChoseAvatar
                  setAvatarId={setAvatarId}
                  avatarId={avatarId}
                  submitAvatar={submitAvatar}
                  title="Choose Your Avatar"
                  images={images}
                />
              </div>
            ) : null}
            <div>
              <div>
                <div className="flex justify-center  items-center mb-12  -z-50">
                  <motion.div
                    key={question}
                    initial={{ y: "50%", opacity: 0, scale: 0.25 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className=" w-[55vw]  shadow-xl h-[45vh] bg-gray-100 text-gray-800 "
                    onClick={() => {
                      setQuestion(`${questions[getRandomInt(0, 159)]}`);
                    }}
                  >
                    <p className="p-4 flex items-center text-xl leading-7 font-semibold">
                      {question}
                    </p>
                    <div className="card-actions"></div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-[repeat(4,minmax(10px,90px))] gap-2 m-3 ">
                  {roomSnapshot.players.map((player, i) => {
                    if (player.uid != user.providerData[0].uid) {
                      return (
                        <div
                          className={
                            vote
                              ? vote == player.uid
                                ? "rounded-lg shadow-xl p-2 bg-base-300 h-full animate-pulse filter"
                                : "rounded-lg shadow-xl p-2 bg-base-300 h-full  filter brightness-75"
                              : "rounded-lg shadow-xl p-2 bg-base-300 h-full filter "
                          }
                          key={`avatar-${i}`}
                        >
                          <label id={i} htmlFor={`avatar-${i}`}>
                            <Image
                              className="rounded-md "
                              src={images[player.avatarID]}
                              alt={`avatar-${i}`}
                              key={`avatar-${i}`}
                            />
                            <div>
                              <h2 className="truncate my-1">
                                {player.name.split(" ")[0]}
                              </h2>
                            </div>
                          </label>
                          <input
                            type="radio"
                            id={`avatar-${i}`}
                            name="avatar"
                            value={player.uid}
                            onChange={changeVote}
                            className="hidden"
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center w-[100vw] items-center h-[80vh]">
          <LoadingSpinner size="10" />
        </div>
      )}
    </div>
  );
}

export default Rooms;
