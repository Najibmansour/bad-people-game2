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
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase, database } from "../../firebase-config";
import { fetchUserData } from "../../utils/fetchUserData";

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomsCollectionRef = collection(database, "room");
  const [players, setPlayers] = useState();

  const [user, loading, error] = useAuthState(getAuth());

  const [roomSnapshot, setRoomSnapshot] = useState({});
  const roomRef = doc(database, "room", `${roomId}`);

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    const unsub = onSnapshot(q, (snapshot) => {
      // console.log(snapshot.docs[0].get("players"));
      snapshot.docs.forEach((doc) => {
        setRoomSnapshot(doc.data());
        setPlayers(doc.data().players);
        arrayFuck(doc.data());
      });
    });
    return unsub;
  }, [router.isReady]);

  const arrayFuck = (roomSnapshot) => {
    const user = fetchUserData();
    console.log(user);
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      const newPlayer = {
        uid: `${user[0].uid}`,
        name: `${user[0].displayName}`,
        photoUrl: "asddsaasdasdsdaasd",
      };
      console.log("addfuck");
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

  return (
    <div>
      {roomSnapshot != "undefined" ? (
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
        <button
          className="btn"
          onClick={() => {
            console.log(roomSnapshot);
          }}
        >
          huh
        </button>
      )}
    </div>
  );
}

export default Rooms;
