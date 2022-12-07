export const numericalProperties = [
  { name: "Min. Cap Diameter", prop: "minCapDiameter" },
  { name: "Max. Cap Diameter", prop: "maxCapDiameter" },
  { name: "Min. Stem Height", prop: "minStemHeight" },
  { name: "Max. Stem Height", prop: "maxStemHeight" },
  { name: "Min. Stem Width", prop: "minStemWidth" },
  { name: "Max. Stem Width", prop: "maxStemWidth" },
];

const edibilityFilterOptions = {
  edibility: [
    { name: "All", value: -1 },
    { name: "Edible", value: 1 },
    { name: "Poisonous", value: 0 },
  ],
};

const occurrenceFilterOptions = {
  seasons: [
    { name: "Spring", value: "s" },
    { name: "Summer", value: "u" },
    { name: "Autumn", value: "a" },
    { name: "Winter", value: "w" },
  ],
  habitats: [
    { name: "Grasses", value: "g" },
    { name: "Leaves", value: "l" },
    { name: "Meadows", value: "m" },
    { name: "Paths", value: "p" },
    { name: "Heaths", value: "h" },
    { name: "Urban", value: "u" },
    { name: "Waste", value: "w" },
    { name: "Woods", value: "d" },
  ],
};

const capFilterOptions = {
  shape: [
    { name: "Bell", value: "b" },
    { name: "Conical", value: "c" },
    { name: "Convex", value: "x" },
    { name: "Flat", value: "f" },
    { name: "Sunken", value: "s" },
    { name: "Spherical", value: "p" },
    { name: "Others", value: "o" },
  ],
  surface: [
    { name: "Fibrous", value: "i" },
    { name: "Grooves", value: "g" },
    { name: "Scaly", value: "y" },
    { name: "Smooth", value: "s" },
    { name: "Shiny", value: "h" },
    { name: "Leathery", value: "l" },
    { name: "Silky", value: "k" },
    { name: "Sticky", value: "t" },
    { name: "Wrinkled", value: "w" },
    { name: "Fleshy", value: "e" },
  ],
  color: [
    { name: "brown", value: "n" },
    { name: "buff", value: "b" },
    { name: "gray", value: "g" },
    { name: "green", value: "r" },
    { name: "pink", value: "p" },
    { name: "purple", value: "u" },
    { name: "red", value: "e" },
    { name: "white", value: "w" },
    { name: "yellow", value: "y" },
    { name: "blue", value: "l" },
    { name: "orange", value: "o" },
    { name: "black", value: "k" },
  ],
};

export const filterOptions = {
  edibility: edibilityFilterOptions,
  occurrence: occurrenceFilterOptions,
  cap: capFilterOptions,
};

export default {
  numericalProperties,
  filterOptions,
};
