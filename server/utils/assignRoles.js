export const assignRoles = (shuffledUsers) => {
  const assignedRoles = [];

  const roleCounts = {
    mafia: 2,
    don: 1,
    doctor: 1,
    detective: 1,
    killer: 1,
    townperson: 5,
  };

  for (const user of shuffledUsers) {
    let role = null;

    if (roleCounts.mafia > 0) {
      role = {
        roleId: 1,
        name: "mafia",
        description: "Mafia",
        ability: "kill",
      };
      roleCounts.mafia--;
    } else if (roleCounts.don > 0) {
      role = {
        roleId: 2,
        name: "don",
        description: "Don",
        ability: ["kill", "guess-detective"],
      };
      roleCounts.don--;
    } else if (roleCounts.doctor > 0) {
      role = {
        roleId: 3,
        name: "doctor",
        description: "Doctor",
        ability: "save",
      };
      roleCounts.doctor--;
    } else if (roleCounts.detective > 0) {
      role = {
        roleId: 4,
        name: "detective",
        description: "Detective",
        ability: "guess-mafia",
      };
      roleCounts.detective--;
    } else if (roleCounts.killer > 0) {
      role = {
        roleId: 5,
        name: "killer",
        description: "Killer",
        ability: "kill",
      };
      roleCounts.killer--;
    } else {
      role = {
        roleId: 6,
        name: "townperson",
        description: "Town Person",
      };
    }

    assignedRoles.push(role);
  }

  return assignedRoles;
};
