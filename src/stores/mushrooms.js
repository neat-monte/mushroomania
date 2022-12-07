import { reactive, computed } from "vue";
import { defineStore } from "pinia";

import mushroomData from "@/data/mushroom-data.json";

export const useMushroomStore = defineStore("mushrooms", () => {
  const defaultOptions = {
    edibility: {
      edibility: -1,
    },
    occurrence: {
      seasons: ["s", "u", "a", "w"],
      habitats: ["g", "l", "m", "p", "h", "u", "w", "d"],
    },
    cap: {
      shape: ["b", "c", "x", "f", "s", "p", "o"],
      // surface: ["i", "g", "y", "s", "h", "l", "k", "t", "w", "e"],
      color: ["n", "b", "g", "r", "p", "u", "e", "w", "y", "l", "o", "k"],
    },
  };

  const filterOptions = reactive(structuredClone(defaultOptions));

  const data = computed(() => {
    let data = mushroomData;
    data = data.filter(isEdible(filterOptions.edibility.edibility));
    data = data.filter(containsAny(filterOptions.occurrence.seasons, "season"));
    data = data.filter(
      containsAny(filterOptions.occurrence.habitats, "habitat")
    );
    data = data.filter(containsAny(filterOptions.cap.shape, "capShape"));
    // data = data.filter(containsAny(filterOptions.cap.surface, "capSurface"));
    data = data.filter(containsAny(filterOptions.cap.color, "capColor"));
    return data;
  });

  const resetToDefault = () => {
    Object.assign(filterOptions, structuredClone(defaultOptions));
  };

  return { resetToDefault, filterOptions, data };
});

const isEdible = (edible) => {
  if (edible === -1) return (m) => m;
  return (mushroom) => {
    return Boolean(edible) !== mushroom.poisonous;
  };
};

const containsAny = (contents, prop) => {
  return (mushroom) => {
    return mushroom[prop].some((p) => contents.includes(p));
  };
};

export default useMushroomStore;
