function getPhase(phase) {
  switch (phase) {
    case 1:
      return "Strategy";
    case 2:
      return "Content";
    case 3:
      return "Publishing";
    case 4:
      return "Review";
    default:
      return "Strategy";
  }
}

module.exports = {
  getPhase
};