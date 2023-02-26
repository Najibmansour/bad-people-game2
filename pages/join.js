import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Join() {
  const router = useRouter();
  const [roomId, setRoomId] = useState();
  return (
    <div className="flex flex-col justify-center items-center mt-[70%]">
      <input type="text" className="input input-primary " />
      <button
        className="btn btn-lg btn-primary mt-7"
        onClick={() => {
          router.route(`/room/${roomId}`);
        }}
      >
        JOIN ROOM
      </button>
    </div>
  );
}

export default Join;
