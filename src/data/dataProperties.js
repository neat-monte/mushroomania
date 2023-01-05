import filterOptions from "@/data/filterOptions";

export const numericalProperties = [
  { name: "Min. Cap Diameter cm", prop: "minCapDiameter" },
  { name: "Max. Cap Diameter cm", prop: "maxCapDiameter" },
  { name: "Min. Stem Height cm", prop: "minStemHeight" },
  { name: "Max. Stem Height cm", prop: "maxStemHeight" },
  { name: "Min. Stem Width cm", prop: "minStemWidth" },
  { name: "Max. Stem Width cm", prop: "maxStemWidth" },
];

export const combinedNumericalProperties = [
  { name: "Cap Diameter cm", prop: "CapDiameter" },
  { name: "Stem Height cm", prop: "StemHeight" },
  { name: "Stem Width cm", prop: "StemWidth" },
];

export const categoricalProperties = [
  {
    name: "Edibility",
    prop: "poisonous",
    canHaveMoreThanOneValue: false,
    values: filterOptions.edibility.edibility.filter((c) => c.value !== "none"),
  },
  {
    name: "Damage visibility",
    prop: "doesBruiseOrBleed",
    canHaveMoreThanOneValue: false,
    values: filterOptions.damage.damage.filter((c) => c.value !== "none"),
  },
  {
    name: "Ring or not",
    prop: "hasRing",
    canHaveMoreThanOneValue: false,
    values: filterOptions.stem.hasRing.filter((c) => c.value !== "none"),
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
