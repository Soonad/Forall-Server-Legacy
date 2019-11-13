export default {
  url: process.env.DATABASE_URL,
  keepConnectionAlive: process.env.NODE_ENV === "test",
};
