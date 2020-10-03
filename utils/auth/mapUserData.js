export const mapUserData = (user) => {
  const { uid, email, xa, photoURL, displayName } = user;
  return {
    id: uid,
    email,
    token: xa,
    photoURL,
    displayName,
  };
};
