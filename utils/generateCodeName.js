const codenames = ["The Nightingale", "The Kraken", "The Falcon", "Shadow Viper", "The Ghost", "Bravo Six"];

exports.generateCodename = () => {
  return codenames[Math.floor(Math.random() * codenames.length)];
};


