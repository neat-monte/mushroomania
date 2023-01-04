import filterOptions from "@/data/filterOptions";

export const numericalProperties = [
  { name: "Min. Cap Diameter", prop: "minCapDiameter" },
  { name: "Max. Cap Diameter", prop: "maxCapDiameter" },
  { name: "Min. Stem Height", prop: "minStemHeight" },
  { name: "Max. Stem Height", prop: "maxStemHeight" },
  { name: "Min. Stem Width", prop: "minStemWidth" },
  { name: "Max. Stem Width", prop: "maxStemWidth" },
];

export const combinedNumericalProperties = [
  { name: "Cap Diameter", prop: "CapDiameter" },
  { name: "Stem Height", prop: "StemHeight" },
  { name: "Stem Width", prop: "StemWidth" },
];

export const categoricalProperties = [
  {
    name: "Edibility",
    prop: "poisonous",
    canHaveMoreThanOneValue: false,
    values: filterOptions.edibility.edibility.filter((c) => c.value !== -1),
  },
  {
    name: "Damage visibility",
    prop: "doesBruiseOrBleed",
    canHaveMoreThanOneValue: false,
    values: filterOptions.other.damageVisibility,
  },
  {
    name: "Ring or not",
    prop: "hasRing",
    canHaveMoreThanOneValue: false,
    values: filterOptions.stem.hasRing.filter((c) => c.value !== -1),
  },
  {
    name: "Habitat",
    prop: "habitat",
    canHaveMoreThanOneValue: true,
    values: filterOptions.occurrence.habitats,
  },
  {
    name: "Season",
    prop: "season",
    canHaveMoreThanOneValue: true,
    values: filterOptions.occurrence.seasons,
  },
  {
    name: "Cap shape",
    prop: "capShape",
    canHaveMoreThanOneValue: true,
    values: filterOptions.cap.shape,
  },
  {
    name: "Cap color",
    prop: "capColor",
    canHaveMoreThanOneValue: true,
    values: filterOptions.cap.color,
  },
  {
    name: "Gill color",
    prop: "gillColor",
    canHaveMoreThanOneValue: true,
    values: filterOptions.cap.gillColor,
  },
  {
    name: "Stem color",
    prop: "stemColor",
    canHaveMoreThanOneValue: true,
    values: filterOptions.stem.color,
  },
  {
    name: "Ring type",
    prop: "ringType",
    canHaveMoreThanOneValue: true,
    values: filterOptions.stem.ringType,
  },
];

export const dataProperties = {
  numerical: numericalProperties,
  combinedNumerical: combinedNumericalProperties,
  categorical: categoricalProperties,
};

export default dataProperties;
