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
    { name: "Brown", value: "n" },
    { name: "Buff", value: "b" },
    { name: "Gray", value: "g" },
    { name: "Green", value: "r" },
    { name: "Pink", value: "p" },
    { name: "Purple", value: "u" },
    { name: "Red", value: "e" },
    { name: "White", value: "w" },
    { name: "Yellow", value: "y" },
    { name: "Blue", value: "l" },
    { name: "Orange", value: "o" },
    { name: "Black", value: "k" },
  ],
  gillColor: [
    { name: "Brown", value: "n" },
    { name: "Buff", value: "b" },
    { name: "Gray", value: "g" },
    { name: "Green", value: "r" },
    { name: "Pink", value: "p" },
    { name: "Purple", value: "u" },
    { name: "Red", value: "e" },
    { name: "White", value: "w" },
    { name: "Yellow", value: "y" },
    { name: "Blue", value: "l" },
    { name: "Orange", value: "o" },
    { name: "Black", value: "k" },
    { name: "None", value: "f" },
  ],
};

const stemFilterOptions = {
  color: [
    { name: "Brown", value: "n" },
    { name: "Buff", value: "b" },
    { name: "Gray", value: "g" },
    { name: "Green", value: "r" },
    { name: "Pink", value: "p" },
    { name: "Purple", value: "u" },
    { name: "Red", value: "e" },
    { name: "White", value: "w" },
    { name: "Yellow", value: "y" },
    { name: "Blue", value: "l" },
    { name: "Orange", value: "o" },
    { name: "Black", value: "k" },
    { name: "None", value: "f" },
  ],
  hasRing: [
    { name: "All", value: -1 },
    { name: "One or more", value: 1 },
    { name: "No ring", value: 0 },
  ],
  ringType: [
    { name: "Cobwebby", value: "c" },
    { name: "Evanescent", value: "e" },
    { name: "Flaring", value: "r" },
    { name: "Grooved", value: "g" },
    { name: "Large", value: "l" },
    { name: "Pendant", value: "p" },
    { name: "Sheathing", value: "s" },
    { name: "Zone", value: "z" },
    { name: "Scaly", value: "y" },
    { name: "Movable", value: "m" },
    { name: "None", value: "f" },
    { name: "Unknown", value: "?" },
  ],
};

const otherProperties = {
  damageVisibility: [
    { name: "Bruise or bleed", value: true },
    { name: "No changes", value: false },
  ],
};

export const filterOptions = {
  edibility: edibilityFilterOptions,
  occurrence: occurrenceFilterOptions,
  cap: capFilterOptions,
  stem: stemFilterOptions,
  other: otherProperties,
};

export default filterOptions;
