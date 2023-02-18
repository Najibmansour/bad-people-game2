import React, { useEffect } from "react";
import LoadingSpinner from "./loadingSpinner";
import { signInWithRedirect, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase-config";
import LogButton from "./buttons/logButton";

const LoginDiv = () => {
  const googleAuth = new GoogleAuthProvider();
  const auth = getAuth(firebase);
  const [user, loading, error] = useAuthState(auth);

  googleAuth.setCustomParameters({
    prompt: "select_account",
  });

  const signIn = async () => {
    console.log("signing in");
    await signInWithRedirect(auth, googleAuth).catch((err) => {
      console.log(err.message);
    });

    // const { refreshToken, providerData } = user;
    // localStorage.setItem("user", JSON.stringify(providerData));
    // localStorage.setItem("accessToken", JSON.stringify(refreshToken));
  };

  const signOut = () => {
    auth.signOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };
  const test = () => {
    console.log("TEST");
  };

  useEffect(() => {
    if (user !== null) {
      console.log(user);

      const { refreshToken, providerData } = user;
      localStorage.setItem("user", JSON.stringify(providerData));
      localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    }
  }, [user]);

  return (
    <div className="">
      <div>
        {user ? (
          <div className=" h-10 w-10 mr-2">
            {/* <button
              className="bg-primary px-3 py-2 rounded-lg"
              onClick={signOut}
            >
              Sign Out
            </button> */}
            <img
              className="rounded-full border-x-2 border-y-2 border-green-300"
              src={user.photoURL}
            />
          </div>
        ) : (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button
                className="bg-primary px-3 py-2 rounded-lg"
                onClick={signIn}
              >
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
