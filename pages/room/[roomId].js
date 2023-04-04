import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  arrayUnion,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ChoseAvatar from "../../components/chooseAvatar";
import { database } from "../../firebase-config";
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
import { motion, AnimatePresence } from "framer-motion";
import useCountDown from "react-countdown-hook";
import useUpdateNotUndefinedEffect from "../../utils/useUpdateNotUndefinedEffectHook";

const questions = require("../../public/questions.json");

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomsCollectionRef = collection(database, "room");
  const [timeLeft, { start }] = useCountDown(5000, 1000);

  const [user, loading, error] = useAuthState(getAuth());
  const [canSelect, setCanSelect] = useState(false);

  const [roomSnapshot, setRoomSnapshot] = useState();
  const roomRef = doc(database, "room", `${roomId}`);

  const [avatarId, setAvatarId] = useState(0);
  const [question, setQuestion] = useState();
  const [gameState, setGameState] = useState();

  const vote = useRef();
  const index = useRef(0);

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    const accessToken = fetchUserAccessToken();
    if (!accessToken) {
      router.push("/");
    } else {
      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          setRoomSnapshot(doc.data());
          setGameState(doc.data().state);
          const index = doc
            .data()
            .players.findIndex(
              (player) => player.uid == user.providerData[0].uid
            );

          if (vote.current == undefined && doc.data().players.length > 1) {
            const arr = doc
              .data()
              .players.filter(
                (player) => player.uid != user.providerData[0].uid
              );
            console.log(arr);
            vote.current = arr[0].uid;
          }

          index == -1 ? setCanSelect(true) : null;
          initGame(doc.data());
        });
      });
      return unsub;
    }
  }, [router.isReady, user]);

  useUpdateNotUndefinedEffect(() => {
    const interval = setInterval(() => {
      const questions = roomSnapshot.questions;
      const questionsTime = roomSnapshot.questionsTime;
      if (Date.now() >= questionsTime[index.current]) {
        if (roomSnapshot.state == 11) {
          setQuestion(questions[index.current]);
          index.current = index.current + 1;
          console.log("index:", index.current);
          console.log("vote:", vote.current);
          updateDoc(roomRef, {
            [`answers.${index.current}`]: arrayUnion({
              name: user.providerData[0].displayName,
              uid: user.providerData[0].uid,
              vote: vote.current,
            }),
          });
        }
      }
      if (
        index == questions.length &&
        user.providerData[0].uid == roomSnapshot.owner
      ) {
        const obj = {
          name: user.providerData[0].displayName,
          uid: user.providerData[0].uid,
        };
        // updateDoc(roomRef, { state: 22 });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [roomSnapshot]);

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
    vote.current = e.target.value;
  }

  function initGame(roomsnap) {
    if (roomsnap.state === 1) {
      setTimeout(() => {
        if (roomsnap.owner == user.providerData[0].uid) {
          updateDoc(roomRef, { state: 11 }); //state 0:created 1:started 11:start, 2:end, 22:ended})
          console.log(roomsnap.state);
        }
      }, 5000);

      start(5000);
    }
  }

  function startGameByOwner() {
    let date = new Date();
    date = date.getTime();
    const questionTimeArray = [];
    for (let i = 0; i < roomSnapshot.questions.length + 1; i++) {
      let newDate = date + roomSnapshot.roundTime * 1000;
      date = newDate;
      questionTimeArray.push(newDate);
    }
    roomSnapshot.state == 0
      ? updateDoc(roomRef, { questionsTime: questionTimeArray, state: 1 })
      : updateDoc(roomRef, { questionsTime: questionTimeArray }); //state 0:created 1:started 11:start, 2:end, 22:ended
  }

  const counterAnimation = {
    hidden: {
      y: "-100vh",
      zIndex: 9999,
      opacity: 0.1,
      transition: {
        duration: 0.4,
      },
    },
    visible: {
      y: "0",
      zIndex: 9999,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0.1,
      zIndex: 9999,
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
            {roomSnapshot.owner == user.providerData[0].uid &&
              roomSnapshot.state == 0 && (
                <button onClick={startGameByOwner} className="btn btn-primary">
                  start
                </button>
              )}
          </div>

          <div className="flex justify-center fixed w-[100vw] h-[200vh]  ">
            <AnimatePresence>
              {timeLeft != 0 && (
                <motion.div
                  key={timeLeft}
                  variants={counterAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-6xl text-warning font-mono fixed  mt-[40vh]"
                >
                  {timeLeft.toString()[0]}
                </motion.div>
              )}
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
                <div className="flex justify-center  items-center mb-12 ">
                  {gameState == 11 && question != null && (
                    <motion.div
                      key={question}
                      initial={{ y: "50%", opacity: 0, scale: 0.25 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      className="rounded-xl w-[55vw] shadow-xl h-[45vh] bg-gray-100 text-gray-800 -z-50  "
                    >
                      <p className="p-4 flex items-center text-xl leading-7 font-semibold">
                        {questions[question]}
                      </p>
                      <div className="card-actions"></div>
                    </motion.div>
                  )}
                </div>
                {gameState != 22 ? (
                  <div className="grid grid-cols-[repeat(4,minmax(10px,90px))] gap-2 m-3 ">
                    {roomSnapshot.players.map((player, i) => {
                      if (player.uid != user.providerData[0].uid) {
                        return (
                          <div
                            className={
                              vote.current
                                ? vote.current == player.uid
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
                              onClick={changeVote}
                              className="hidden"
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      updateDoc(roomRef, { state: 0 });
                    }}
                  >
                    RESTART
                  </button>
                )}
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

function updateCard(roomSnapshot) {
  useEffect(() => {}, [roomSnapshot]);
}

export default Rooms;
