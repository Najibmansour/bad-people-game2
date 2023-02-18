export const fetchUserData = () => {
  const userData =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.removeItem("user");
  return userData;
};
