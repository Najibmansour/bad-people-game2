import React, { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import app from "../firebase-config";

const LoginDiv = () => {
  const googleAuth = new GoogleAuthProvider();
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);
  const [LOADING, setLOADING] = useState(false);

  googleAuth.setCustomParameters({
    prompt: "select_account",
  });

  const signIn = async () => {
    const asd = await signInWithPopup(auth, googleAuth)
      .then((e) => {
        console.log(e);

        const { refreshToken, providerData } = e;
        localStorage.setItem("user", JSON.stringify(providerData));
        localStorage.setItem("accessToken", JSON.stringify(refreshToken));
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const signOut = () => {
    auth.signOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user !== null) {
      const { refreshToken, providerData } = user;
      localStorage.setItem("user", JSON.stringify(providerData));
      localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    }
  }, [user]);

  return (
    <div className="">
      <div>
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full  ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <button onClick={signOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            {loading ? (
              <LoadingSpinner size={8} />
            ) : (
              <button className="btn btn-primary btn-md" onClick={signIn}>
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginDiv;
