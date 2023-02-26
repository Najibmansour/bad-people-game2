import Image from "next/image";
import React, { useState } from "react";

function ChoseAvatar({
  setAvatarId,
  avatarId,
  title,
  submitAvatar,
  images,
  alreadySelectedAvatars,
}) {
  const [isOpen, setOpen] = useState(true);

  function changeAvatar(e) {
    setAvatarId(e.target.value);
    // console.log(avatarId);
  }

  return (
    <div>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div
        className={
          !isOpen
            ? "modal modal-bottom sm:modal-middle"
            : "modal modal-open modal-bottom sm:modal-middle"
        }
      >
        <div className="modal-box ">
          <div className="flex flex-col justify-center">
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {images.map((ava, i) => (
              <div>
                <div className="form-control">
                  <label id={i} htmlFor={`avatar-${i}`}>
                    <Image
                      alt={`avatar-${i}`}
                      key={`avatar-${i}`}
                      className={
                        avatarId == i
                          ? "rounded-md border-4 border-primary animate-pulse-avatar"
                          : "rounded-md border-2 border-neutral "
                      }
                      src={ava}
                    />
                  </label>
                  <input
                    type="radio"
                    id={`avatar-${i}`}
                    name="avatar"
                    value={i}
                    onChange={changeAvatar}
                    className="hidden"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className=" modal-action flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(false);
                submitAvatar();
              }}
            >
              JOIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoseAvatar;
