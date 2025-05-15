exports.getMissionSuccessProbability = () => {
  return `${Math.floor(Math.random() * 51) + 50}% success probability`; // 50-100%
};