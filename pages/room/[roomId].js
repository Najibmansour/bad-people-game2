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

  // const q = query(database, "room", `${roomId}`);

  const [players, setPlayers] = useState();
  const [user, loading, error] = useAuthState(getAuth());
  const [roomSnapshot, setRoomSnapshot] = useState({});
  const roomRef = doc(database, "room", `${roomId}`);

  useEffect(() => {
    const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
    console.log(q);
    const unsub = onSnapshot(q, (snapshot) => {
      // console.log(snapshot.docs[0].get("players"));
      snapshot.docs.forEach((doc) => {
        setRoomSnapshot(doc.data());
        setPlayers(doc.data().players);
      });
    });
    return unsub;
  }, [router.isReady]);

  const arrayFuck = () => {
    if (roomSnapshot.maxPlayers > roomSnapshot.players.length) {
      if (!roomSnapshot.players.includes(`${user.providerData[0].uid}`)) {
        const newPlayer = {
          uid: `${user.providerData[0].uid}`,
          name: `${user.providerData[0].displayName}`,
          photoUrl: "asddsaasdasdsdaasd",
        };
        console.log("addfuck");
        updateDoc(roomRef, { players: arrayUnion(newPlayer) });
      } else {
        console.log("player exist"); // @DEV add modal error if player already in session
      }
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
            {players ? players.map((player) => <p>{player.name}</p>) : null}
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
