function getPhaseForSMM(phase) {
  switch (phase) {
    case 1:
      return 'Strategy';
    case 2:
      return 'Content';
    case 3:
      return 'Publishing';
    case 4:
      return 'Review';
    case 5:
      return 'Completed';
    default:
      return 'Strategy';
  }
}

function getPhaseForWDS(phase) {
  switch (phase) {
    case 1:
      return 'Design';
    case 2:
      return 'Development';
    case 3:
      return 'Testing';
    case 4:
      return 'Launch';
    case 5:
      return 'Completed';
    default:
      return 'Design';
  }
}

function getPhaseStringForProject(package_type) {
  switch (package_type) {
    case 'va':
      return 'In Progress';
    case 'obm':
      return 'In Progress';
    case 'smm':
      return 'Strategy';
    case 'wds':
      return 'Review';
    default:
      return 'Design';
  }
}

module.exports = {
  getPhaseForSMM,
  getPhaseStringForProject,
  getPhaseForWDS
};
