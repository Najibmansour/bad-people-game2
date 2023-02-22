export const fetchUserAccessToken = () => {
  const accessToken =
    localStorage.getItem("accessToken") !== "undefined"
      ? JSON.parse(localStorage.getItem("accessToken"))
      : localStorage.removeItem("accessToken");
  return accessToken;
};
