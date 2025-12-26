const SnowayAPI = require("snoway-api");
const api = new SnowayAPI(process.env.PREVNAMES_API_TOKEN);

const prevnamesRequest = async (userId: string) => {
  try {
    const prevnames = await api.allPrevnames(userId);
    return prevnames.names;
  } catch {
    return null;
  }
};

export { prevnamesRequest };
