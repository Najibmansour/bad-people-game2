import React, { useState } from "react";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";

const Modal = ({ roomId, text, title, isEnabled }) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  return (
    <div>
      <div className={isEnabled ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{text}</p>
          <div className="flex flex-row items-center gap-3">
            <input
              defaultValue={`bad-people-online-game.vercel.app/room/${roomId}`}
              className="input input-bordered input-sm w-[90%] max-w-xs truncate"
            ></input>
            <button
              className={
                copied
                  ? "btn btn-success btn-sm btn-square"
                  : "btn  btn-sm btn-square"
              }
              onClick={() => {
                copy(`bad-people-online-game.vercel.app/room/${roomId}`);
                setCopied(true);
              }}
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                  stroke="#000000"
                ></path>
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H12H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                  stroke="#000000"
                ></path>
              </svg>
            </button>
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                router.push(`/room/${roomId}`);
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
