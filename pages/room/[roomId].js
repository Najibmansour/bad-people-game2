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
  const [players, setPlayers] = useState();

  const [user, loading, error] = useAuthState(getAuth());

  const [roomSnapshot, setRoomSnapshot] = useState({});
  const roomRef = doc(database, "room", `${roomId}`);

  const [avatarId, setAvatarId] = useState(0);

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setRoomSnapshot(doc.data());
        setPlayers(doc.data().players);
        arrayFuck(doc.data());
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
    deleteDoc();
  });

  const arrayFuck = (roomSnapshot) => {
    const user = fetchUserData();
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      const newPlayer = {
        uid: `${user[0].uid}`,
        name: `${user[0].displayName}`,
        photoUrl: "asddsaasdasdsdaasd",
      };
      updateDoc(roomRef, { players: arrayUnion(newPlayer) });
    } else {
      console.log("room is full"); // @DEV add modal if room is full
    }
  };

  const handleUserLeave = () => {
    const snap = roomSnapshot;
    // delete snap.players[`${user.providerData[0].uid}`];
    console.log(snap);
    // deleteDoc(roomRef, snap);
  };

  const submitAvatar = () => {
    console.log(avatarId);
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
      {!roomSnapshot ? (
        <div>
          <h1>
            {players
              ? players.map((player) => (
                  <div className="card" key={player.uid}>
                    {player.name}
                  </div>
                ))
              : null}
          </h1>
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
          <button className="btn btn-primary" onClick={handleUserLeave}>
            log user
          </button>
        </div>
      ) : (
        <div>
          <ChoseAvatar
            setAvatarId={setAvatarId}
            avatarId={avatarId}
            submitAvatar={submitAvatar}
            title="Choose Your Avatar"
            images={images}
          />
        </div>
      )}
    </div>
  );
}

export default Rooms;
