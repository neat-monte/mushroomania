import filterOptions from "@/data/filterOptions";

export const mapMushroomToRepresentative = (mushroom) => {
  if (!mushroom.name) {
    return {};
  }
  return {
    name: mushroom.name,
    family: mushroom.family,
    edible: mushroom.poisonous ? "No" : "Yes",
    damage: mushroom.doesBruiseOrBleed
      ? "Bruises or bleeds"
      : "Shows no changes",
    habitats: mapValuesToString("occurrence", "habitats", mushroom.habitat),
    seasons: mapValuesToString("occurrence", "seasons", mushroom.season),
    capDiameter: `${mushroom.minCapDiameter}-${mushroom.maxCapDiameter} cm`,
    capShape: mapValuesToString("cap", "shape", mushroom.capShape),
    capColor: mapValuesToString("cap", "color", mushroom.capColor),
    gillColor: mapValuesToString("cap", "gillColor", mushroom.gillColor),
    stemWidth: `${mushroom.minStemWidth}-${mushroom.maxStemWidth} cm`,
    stemHeight: `${mushroom.minStemHeight}-${mushroom.maxStemHeight} cm`,
    stemColor: mapValuesToString("stem", "color", mushroom.stemColor),
    hasRing: mushroom.hasRing ? "Yes" : "No",
    ringType: mapValuesToString("stem", "ringType", mushroom.ringType),
    url: mushroom.url,
  };
};

const mapValuesToString = (primaryProp, secondaryProp, list) => {
  return filterOptions[primaryProp][secondaryProp]
    .filter((prop) => list.includes(prop.value))
    .map((prop) => prop.name)
    .join(", ");
};

export default mapMushroomToRepresentative;
