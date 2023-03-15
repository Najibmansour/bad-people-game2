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
  }, [router.isReady, user]);

  const delPlayer = () => {
    const user = fetchUserData();

    const existingPlayer = {
      uid: `${user[0].uid}`,
      name: `${user[0].displayName}`,
      avatarID: avatarId,
    };
    updateDoc(roomRef, { players: arrayRemove(existingPlayer) });
  };

  const addPlayer = (roomSnapshot) => {
    const user = fetchUserData();
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      const newPlayer = {
        uid: `${user[0].uid}`,
        name: `${user[0].displayName}`,
        avatarID: avatarId,
      };
      updateDoc(roomRef, { players: arrayUnion(newPlayer) });
    } else {
      console.log("room is full"); // @DEV add modal if room is full
    }
  };

  const submitAvatar = () => {
    console.log(roomSnapshot);
    addPlayer(roomSnapshot);
  };

  const addTest = () => {
    const uid = Date.now();
    const newPlayer = {
      uid: `${uid}`,
      name: `TEST PLAYER`,
      avatarID: "5",
    };
    updateDoc(roomRef, { players: arrayUnion(newPlayer) });
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

  return (
    <div>
      {!loading ? (
        <>
          <div className="flex flex-col justify-cente items-center ">
            asdasda
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
              
              {roomSnapshot ? (
                <div className="grid grid-cols-[repeat(4,minmax(10px,500px))] gap-1">
                  {roomSnapshot.players?.map((player, i) => (
                    <div
                      className="rounded-md shadow-xl p-2 bg-base-300 h-full"
                      key={`avatar-${i}`}
                    >
                      <label id={i} htmlFor={`avatar-${i}`}>
                        <Image
                          className="rounded-md"
                          src={images[player.avatarID]}
                          alt={`avatar-${i}`}
                          key={`avatar-${i}`}
                        />
                        <div>
                          <h2 className="truncate">{player.name}</h2>
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center w- items-center h-[80vh]">
                  <LoadingSpinner size="10" />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center w- items-center h-[80vh]">
          <LoadingSpinner size="10" />
        </div>
      )}
    </div>
  );
}

export default Rooms;
