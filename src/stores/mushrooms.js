import { reactive, computed } from "vue";
import { defineStore } from "pinia";

import mushroomData from "@/data/mushroom-data.json";
import filterOptions from "@/data/filterOptions";
import dataProperties from "../data/dataProperties";
import { mapMushroomToRepresentative } from "../utils/mushroomConverter";

const defaultFilters = {
  search: {
    family: null,
    name: null,
  },
  edibility: {
    edibility: "none",
  },
  damage: {
    damage: "none",
  },
  occurrence: {
    seasons: filterOptions.occurrence.seasons.map((s) => s.value),
    isSeasonsStrict: false,
    habitats: filterOptions.occurrence.habitats.map((h) => h.value),
    isHabitatsStrict: false,
  },
  cap: {
    shape: filterOptions.cap.shape.map((s) => s.value),
    color: filterOptions.cap.color.map((c) => c.value),
    gillColor: filterOptions.cap.gillColor.map((gc) => gc.value),
  },
  stem: {
    color: filterOptions.stem.color.map((c) => c.value),
    hasRing: "none",
    ringType: filterOptions.stem.ringType.map((rt) => rt.value),
  },
};

const isOfType = (type, prop) => {
  if (type === "none") return (m) => m;
  return (mushroom) => {
    return type === mushroom[prop];
  };
};

const containsAny = (contents, prop) => {
  return (mushroom) => {
    return mushroom[prop].some((p) => contents.includes(p));
  };
};

const containsAll = (contents, prop) => {
  return (mushroom) => {
    return (
      mushroom[prop].length === contents.length &&
      mushroom[prop].every((p) => contents.includes(p))
    );
  };
};

export const useMushroomStore = defineStore("mushrooms", () => {
  const families = [...new Set(mushroomData.map((m) => m.family))];
  const names = mushroomData.map((m) => m.name);
  const filters = reactive(structuredClone(defaultFilters));

  const selectedMushroom = reactive({});
  // const mushroomProps = () => {};

  const highlightedMushrooms = reactive([]);
  const highlightedProp = reactive({ prop: null, value: null });

  const data = computed(() => {
    let data = mushroomData;
    // calculate averages:
    data.forEach((d) => {
      dataProperties.combinedNumerical.forEach(({ prop: t }) => {
        d[`avg${t}`] = (d[`min${t}`] + d[`max${t}`]) / 2;
      });
    });

    // search:
    if (filters.search.family)
      data = data.filter((d) => d.family == filters.search.family);
    if (filters.search.name && filters.search.name.length > 2)
      data = data.filter(
        (d) =>
          (d.name || "")
            .toLowerCase()
            .indexOf((filters.search.name || "").toLowerCase()) > -1
      );
    // edibility:
    data = data.filter(isOfType(filters.edibility.edibility, "poisonous"));
    // damage:
    data = data.filter(isOfType(filters.damage.damage, "doesBruiseOrBleed"));
    // occurrence:
    data = filters.occurrence.isSeasonsStrict
      ? data.filter(containsAll(filters.occurrence.seasons, "season"))
      : data.filter(containsAny(filters.occurrence.seasons, "season"));
    data = filters.occurrence.isHabitatsStrict
      ? data.filter(containsAll(filters.occurrence.habitats, "habitat"))
      : data.filter(containsAny(filters.occurrence.habitats, "habitat"));
    // cap:
    data = data.filter(containsAny(filters.cap.shape, "capShape"));
    data = data.filter(containsAny(filters.cap.color, "capColor"));
    // stem:
    data = data.filter(containsAny(filters.stem.color, "stemColor"));
    data = data.filter(isOfType(filters.stem.hasRing, "hasRing"));
    data = data.filter(containsAny(filters.stem.ringType, "ringType"));
    return data;
  });

  const setSelectedMushroom = (mushroom) => {
    if (isSelectedMushroom(mushroom)) {
      Object.keys(selectedMushroom).forEach(
        (key) => delete selectedMushroom[key]
      );
    } else {
      Object.assign(selectedMushroom, structuredClone(mushroom));
    }
  };

  const getSelectedMushroomPresentation = () => {
    if (isMushroomSelected()) {
      return mapMushroomToRepresentative(selectedMushroom);
    } else {
      return {};
    }
  };

  const isMushroomSelected = () => {
    return Object.keys(selectedMushroom).length > 0;
  };

  const isSelectedMushroom = (mushroom) => {
    return (
      mushroom.family === selectedMushroom.family &&
      mushroom.name === selectedMushroom.name
    );
  };

  const setHighlightedMushrooms = (prop, value, remove = false) => {
    const propIsArray = Array.isArray(data.value[0][prop]);
    if (remove) {
      let i = 0;
      while (i < highlightedMushrooms.length) {
        if (
          (propIsArray && highlightedMushrooms[i][prop].includes(value)) ||
          highlightedMushrooms[i][prop] == value
        ) {
          highlightedMushrooms.splice(i, 1);
        } else {
          i++;
        }
      }
      return;
    }
    highlightedMushrooms.splice(0, highlightedMushrooms.length);
    if (highlightedProp.prop === prop && highlightedProp.value === value) {
      highlightedProp.value = highlightedProp.prop = null;
    } else {
      highlightedMushrooms.push(
        ...data.value.filter((mushroom) => {
          if (propIsArray) {
            return mushroom[prop].includes(value);
          }
          return mushroom[prop] == value;
        })
      );
      highlightedProp.prop = prop;
      highlightedProp.value = value;
    }
  };

  const setHighlightedMushroomsArray = (newHighlightedMushrooms) => {
    highlightedMushrooms.splice(0, highlightedMushrooms.length);
    highlightedMushrooms.push(...newHighlightedMushrooms);
    highlightedProp.value = highlightedProp.prop = null;
  };

  const isHighlightedMushroom = (mushroom) => {
    return highlightedMushrooms.includes(mushroom);
  };

  const resetToDefault = () => {
    Object.assign(filters, structuredClone(defaultFilters));
  };

  return {
    families,
    names,
    filterOptions: filters,
    resetToDefault,
    data,
    selectedMushroom,
    setSelectedMushroom,
    getSelectedMushroomPresentation,
    isMushroomSelected,
    isSelectedMushroom,
    highlightedMushrooms,
    setHighlightedMushrooms,
    setHighlightedMushroomsArray,
    isHighlightedMushroom,
  };
});

export default useMushroomStore;
