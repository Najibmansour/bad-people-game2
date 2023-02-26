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

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomsCollectionRef = collection(database, "room");

  const [user, loading, error] = useAuthState(getAuth());

  const [roomSnapshot, setRoomSnapshot] = useState();
  const roomRef = doc(database, "room", `${roomId}`);

  const [avatarId, setAvatarId] = useState(0);

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setRoomSnapshot(doc.data());
      });
    });
    return unsub;
  }, [router.isReady]);

  useUnload((e) => {
    e.preventDefault();
    const existingPlayer = {
      uid: `${user[0].uid}`,
      name: `${user[0].displayName}`,
      photoUrl: "asddsaasdasdsdaasd",
    };
  });

  const arrayFuck = (roomSnapshot) => {
    const user = fetchUserData();
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      const newPlayer = {
        uid: `${user[0].uid}`,
        name: `${user[0].displayName}`,
        photoUrl: "asddsaasdasdsdaasd",
        avatarID: avatarId,
      };
      updateDoc(roomRef, { players: arrayUnion(newPlayer) });
    } else {
      console.log("room is full"); // @DEV add modal if room is full
    }
  };

  const submitAvatar = () => {
    console.log(roomSnapshot);
    arrayFuck(roomSnapshot);
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

  return (
    <div>
      {roomSnapshot ? (
        <div>
          {roomSnapshot ? (
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
          <div className="grid grid-flow-row grid-cols-4 gap-3">
            {roomSnapshot ? (
              roomSnapshot.players?.map((player, i) => (
                <div className="rounded-md shadow-xl p-2 bg-base-200">
                  <figure>
                    <Image
                      className="rounded-md"
                      src={images[player.avatarID]}
                      alt={`avatar-${i}`}
                      key={`avatar-${i}`}
                    />
                  </figure>
                  <div className="">
                    <h2 className="">{player.name}</h2>
                  </div>
                </div>
              ))
            ) : (
              <p>no room snap</p>
            )}
          </div>
          <div>hi</div>

          <button className="btn btn-primary" onClick={arrayFuck}>
            addfuck
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              console.log(roomSnapshot);
            }}
          >
            players
          </button>
          <button className="btn btn-primary">log user</button>
        </div>
      ) : null}
    </div>
  );
}

export default Rooms;
