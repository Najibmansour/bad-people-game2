import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "../firebase-config";

function Rooms() {
  const [rooms, roomsLoading, roomsError] = useCollection(
    firebase.firestore().collection("rooms"),
    {}
  );

  if (!roomsLoading && rooms) {
    rooms.docs.map((doc) => console.log(doc.data()));
  }

  return <div></div>;
}

export default Rooms;
