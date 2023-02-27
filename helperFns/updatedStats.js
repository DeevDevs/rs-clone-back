exports.updateStats = (oldStats, memoir, condition) => {
  const newRate = countAverageRate(oldStats, memoir.rateValue, condition);
  const newContinents = updateNestedArray(
    oldStats.continents,
    memoir.continentName,
    condition
  );
  const newCountries = updateNestedArray(
    oldStats.countries,
    memoir.countryName,
    condition
  );
  const newSites = addSites(oldStats.sites, memoir.sites, condition);

  const updateBody = {
    places: updateValue(oldStats.places, 1, condition),
    days: updateValue(oldStats.days, memoir.days, condition),
    averageRate: newRate,
    distance: updateValue(oldStats.distance, memoir.distance, condition),
    sites: JSON.parse(JSON.stringify(newSites)),
    countries: newCountries,
    continents: newContinents,
  };
  return updateBody;
};

function updateNestedArray(array, value, condition) {
  const newArray = [];
  if (condition === "add") {
    let alreadyThere = false;
    array.forEach((instance) => {
      const newInstance =
        instance[0] === value ? [instance[0], `${+instance[1] + 1}`] : instance;
      if (newInstance[1] > instance[1]) alreadyThere = true;
      newArray.push(newInstance);
    });
    if (alreadyThere) return newArray;
    newArray.push([value, "1"]);
  }
  if (condition === "remove") {
    array.forEach((instance) => {
      const newInstance =
        instance[0] === value ? [instance[0], `${+instance[1] - 1}`] : instance;
      if (newInstance[1] === "0") return;
      newArray.push(newInstance);
    });
  }
  return newArray;
}

function addSites(statsSites, memoirSites, condition) {
  const newSitesArray = [];
  if (condition === "add") {
    statsSites.forEach((siteRecord) => {
      if (memoirSites.find((memoirSite) => memoirSite === siteRecord[0])) {
        newSitesArray.push([siteRecord[0], `${+siteRecord[1] + 1}`]);
      } else newSitesArray.push(siteRecord);
    });
    memoirSites.forEach((memoirSite) => {
      if (newSitesArray.find((site) => site[0] === memoirSite)) return;
      newSitesArray.push([memoirSite, "1"]);
    });
  }
  if (condition === "remove") {
    statsSites.forEach((siteRecord) => {
      if (memoirSites.find((memoirSite) => memoirSite === siteRecord[0])) {
        if (siteRecord[1] === "1") return;
        newSitesArray.push([siteRecord[0], `${+siteRecord[1] - 1}`]);
      } else newSitesArray.push(siteRecord);
    });
  }
  return newSitesArray;
}

function countAverageRate(oldStats, memoirRate, condition) {
  let rate;
  if (condition === "add") {
    rate = (oldStats.averageRate * oldStats.places + memoirRate) /
      (oldStats.places + 1);
  }
  if (condition === "remove") {
    if (oldStats.places === 1) return 0;
    if (oldStats.averageRate === 0) return 0;
    rate = (oldStats.averageRate * oldStats.places - memoirRate) /
      (oldStats.places - 1);
  }
  if (rate.toString().includes('.')) {
    const roundedRate = rate.toFixed(1);
    return +roundedRate;
  } else return rate;
}

function updateValue(statsValue, memoirValue, condition) {
  if (condition === "add") return statsValue + memoirValue;
  if (condition === "remove") {
    return statsValue === 0 ? 0 : statsValue - memoirValue;
  }
}
