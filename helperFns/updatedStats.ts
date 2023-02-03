export function updateStats(oldStats, memoir, condition) {
  if (condition === "add") {
    const newRate =
      (oldStats.averageRate * oldStats.places + memoir.rateValue) /
      (oldStats.places + 1);
    const newContinents = oldStats.continents.includes(memoir.continentName)
      ? oldStats.continents
      : [...oldStats.continents, memoir.continentName];
    const newCountries = oldStats.countries.includes(memoir.countryName)
      ? oldStats.countries
      : [...oldStats.countries, memoir.countryName];
    const newSites = [...oldStats.sites, ...memoir.sites].filter(
      (site, index, arr) => arr.indexOf(site) === index
    );
    const updateBody = {
      places: oldStats.places + 1,
      days: oldStats.days + memoir.days,
      averageRate: newRate,
      distance: oldStats.distance + memoir.distance,
      sites: newSites,
      countries: newCountries,
      continents: newContinents,
    };
    return updateBody;
  }
}
