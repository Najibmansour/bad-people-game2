import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { firebase, database } from "../../firebase-config";

function Rooms() {
  const router = useRouter();
  const roomId = router.query.roomId;
  const [rooms, setRooms] = useState([]);
  const roomsCollectionRef = collection(database, "room");
  const q = query(roomsCollectionRef, where("roomNum", "==", `${roomId}`));
  useEffect(() => {
    const getRoom = async () => {
      const querySnapshot = await getDocs(q).catch((err) => {
        console.error(`ERROR => ${err.message}`);
      });
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    };
    getRoom();
  }, [router.isReady]);

  // useEffect(() => {
  //   const getRooms = async () => {
  //     const data = await getDocs(q);
  //     setRooms(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };

  //   getRooms();

  //   console.log(rooms);
  // }, []);

  return (
    <div>
      <h1>{roomId}</h1>
      <button
        onClick={() => {
          console.log(rooms);
        }}
      >
        BALU BALU FALU
      </button>
    </div>
  );
}

export default Rooms;
