import React, { useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";

import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

const LoginDiv = () => {
  const googleAuth = new GoogleAuthProvider();
  googleAuth.setCustomParameters({
    prompt: "select_account",
  });
  const signIn = async () => {
    const result = await signInWithRedirect(auth, googleAuth);
  };
  const signOut = () => {
    auth.signOut();
  };
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-400">
      <div>
        {user ? (
          <div>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button onClick={signIn}>Sign In</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginDiv;
