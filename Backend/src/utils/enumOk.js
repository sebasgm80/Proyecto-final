const enumOk = (fuel) => {
  const enumFuel = ["gasolina", "diesel", "electrico", "hibrido"];
  if (enumFuel.includes(fuel)) {
    console.log("entro en el true");
    return { check: true, fuel };
  } else {
    return {
      check: false,
    };
  }
};

module.exports = enumOk;
