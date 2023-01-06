import { ref, reactive, computed, toRaw } from "vue";
import { defineStore } from "pinia";

import mushroomData from "@/data/mushroom-data.json";
import dataProperties from "@/data/dataProperties";
import { mapMushroomToRepresentative } from "@/utils/mushroomConverter";
import { filters } from "@/utils/filter";

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

  const showOnlyHighlighted = ref(false);
  const selectedMushroom = reactive({});
  const highlightedMushrooms = reactive([]);

  const data = computed(() => {
    let data = mushroomData;
    for (let mushroom of mushroomData) {
      mushroom.minStemWidth /= 10;
      mushroom.maxStemWidth /= 10;
    }
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

  const getFilteredMushrooms = (prop, value) => {
    return toRaw(
      data.value.filter((mushroom) => {
        if (Array.isArray(mushroom[prop])) {
          return mushroom[prop].includes(value);
        }
        return mushroom[prop] == value;
      })
    );
  };

  const setHighlightedMushrooms = (additionalMushrooms, shift, remove) => {
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
      if (remove) {
        highlightedMushrooms.splice(0, highlightedMushrooms.length);
      } else {
        highlightedMushrooms.splice(
          0,
          highlightedMushrooms.length,
          ...additionalMushrooms
        );
      }
    }
  };

  const isHighlightedMushroom = (mushroom) => {
    return highlightedMushrooms.includes(mushroom);
  };

  return {
    families,
    names,
    filterOptions: filters,
    data,
    showOnlyHighlighted,
    toggleShowOnlyHighlighted,
    selectedMushroom,
    setSelectedMushroom,
    getSelectedMushroomPresentation,
    isMushroomSelected,
    isSelectedMushroom,
    highlightedMushrooms,
    getFilteredMushrooms,
    setHighlightedMushrooms,
    isHighlightedMushroom,
  };
});

export default useMushroomStore;
