import filterOptions from "@/data/filterOptions";

const createMap = (filterArray) => {
  return new Map(filterArray.map((obj) => [obj.value, obj.name]));
};

const edibility = {
  title: "Edible",
  map: new Map([
    [true, "Yes"],
    [false, "No"],
  ]),
};

const seasons = {
  title: "Available in seasons",
  map: createMap(filterOptions.occurrence.seasons),
};

const habitats = {
  title: "Found in habitats",
  map: createMap(filterOptions.occurrence.habitats),
};

export const valueMaps = {
  edibility,
  seasons,
  habitats,
};

export default valueMaps;
