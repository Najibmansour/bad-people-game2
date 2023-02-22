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
import { firebase, database } from "../../firebase-config";
import { fetchUserData } from "../../utils/fetchUserData";

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomsCollectionRef = collection(database, "room");
  const q = query(roomsCollectionRef, where("__name__", "==", `${roomId}`));
  const [players, setPlayers] = useState(["asd"]);
  const [user, loading, error] = useAuthState(getAuth());
  const [roomSnapshot, setRoomSnapshot] = useState();
  const roomRef = doc(database, "room", `${roomId}`);

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
        setRoomSnapshot(doc.data());
        const players = Object.entries(doc.data().players);
        // console.log(players[0][1]);
      });
    });
  }, []);

  const arrayFuck = async () => {
    const playerSnap = roomSnapshot.players;
    console.log(roomSnapshot);
    if (roomSnapshot.maxPlayers > Object.keys(roomSnapshot.players).length) {
      if (
        !Object.keys(roomSnapshot.players).includes(
          `${user.providerData[0].uid}`
        )
      ) {
        const newPlayer = Object.assign(playerSnap, {
          [user.providerData[0].uid]: {
            name: `${user.providerData[0].displayName}`,
            photoUrl: "asddsaasdasdsdaasd",
          },
        });
        const newRoom = Object.assign(roomSnapshot, { players: newPlayer });
        console.log(newRoom);
        updateDoc(roomRef, newRoom);
      } else {
        console.log("player exist"); // @DEV add modal error if player already in session
      }
    } else {
      console.log("room is full"); // @DEV add modal if room is full
    }
  };

  const handleUserLeave = () => {
    const snap = roomSnapshot;
    delete snap.players[`${user.providerData[0].uid}`];
    console.log(snap);
    // deleteDoc(roomRef,);
  };

  return (
    <div>
      {roomSnapshot != "undefined" ? (
        <div>
          <h1>{players}</h1>
          <div>hi</div>
          <button className="btn btn-primary" onClick={arrayFuck}>
            addfuck
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
