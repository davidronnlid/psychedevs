// utils/generateState.ts
export const generateRandomState = (length: number = 16): string => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    state += charset[randomIndex];
  }
  return state;
};
