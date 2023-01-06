import { ref, reactive, computed, toRaw } from "vue";
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

  const showOnlyHighlighted = ref(false);
  const selectedMushroom = reactive({});
  const highlightedMushrooms = reactive([]);

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

    if (Object.keys(selectedMushroom).length !== 0) {
      let selectedMushroomFound = false;
      data.forEach((mushroom) => {
        if (!selectedMushroomFound) {
          if (mushroom.name === selectedMushroom.name)
            selectedMushroomFound = true;
        }
      });
      if (!selectedMushroomFound) setSelectedMushroom(selectedMushroom);
    }

    return data;
  });

  const toggleShowOnlyHighlighted = () => {
    showOnlyHighlighted.value = !showOnlyHighlighted.value;
  };

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
    return isEqualMushroom(mushroom, selectedMushroom);
  };

  const isEqualMushroom = (mushroom1, mushroom2) => {
    return (
      mushroom1.family === mushroom2.family && mushroom1.name === mushroom2.name
    );
  };

  const setHighlightedMushrooms = (prop, value, shift, remove) => {
    const matchedMushrooms = toRaw(
      data.value.filter((mushroom) => {
        if (Array.isArray(mushroom[prop])) {
          return mushroom[prop].includes(value);
        }
        return mushroom[prop] == value;
      })
    );

    if (shift) {
      if (remove) {
        const newHighlightedMushrooms = highlightedMushrooms.filter(
          (mushroom) => !matchedMushrooms.includes(toRaw(mushroom))
        );

        highlightedMushrooms.splice(
          0,
          highlightedMushrooms.length,
          ...newHighlightedMushrooms
        );
      } else {
        for (let mushroom of matchedMushrooms) {
          if (!highlightedMushrooms.includes(toRaw(mushroom))) {
            highlightedMushrooms.push(mushroom);
          }
        }
      }
    } else {
      if (remove) {
        highlightedMushrooms.splice(0, highlightedMushrooms.length);
      } else {
        highlightedMushrooms.splice(
          0,
          highlightedMushrooms.length,
          ...matchedMushrooms
        );
      }
    }
  };

  const setHighlightedMushroomsArray = (additionalMushrooms, shift, remove) => {
    if (shift) {
      if (remove) {
        const newHighlightedMushrooms = highlightedMushrooms.filter(
          (mushroom) => !additionalMushrooms.includes(toRaw(mushroom))
        );

        highlightedMushrooms.splice(
          0,
          highlightedMushrooms.length,
          ...newHighlightedMushrooms
        );
      } else {
        for (let mushroom of additionalMushrooms) {
          if (!highlightedMushrooms.includes(toRaw(mushroom))) {
            highlightedMushrooms.push(mushroom);
          }
        }
      }
    } else {
      highlightedMushrooms.splice(
        0,
        highlightedMushrooms.length,
        ...additionalMushrooms
      );
    }
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
    showOnlyHighlighted,
    toggleShowOnlyHighlighted,
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
