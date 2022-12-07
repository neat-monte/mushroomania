import { reactive, computed } from "vue";
import { defineStore } from "pinia";

import mushroomData from "@/data/mushroom-data.json";
import filterOptions from "@/data/filterOptions";

const defaultOptions = {
  edibility: {
    edibility: -1,
  },
  occurrence: {
    seasons: filterOptions.occurrence.seasons.map((s) => s.value),
    habitats: filterOptions.occurrence.habitats.map((h) => h.value),
  },
  cap: {
    shape: filterOptions.cap.shape.map((s) => s.value),
    // surface: filterOptions.cap.surface.map((s) => s.value),
    color: filterOptions.cap.color.map((c) => c.value),
    gillColor: filterOptions.cap.gillColor.map((gc) => gc.value),
  },
  stem: {
    color: filterOptions.stem.color.map((c) => c.value),
    hasRing: -1,
    ringType: filterOptions.stem.ringType.map((rt) => rt.value),
  },
};

export const useMushroomStore = defineStore("mushrooms", () => {
  const filters = reactive(structuredClone(defaultOptions));

  const data = computed(() => {
    let data = mushroomData;
    // edibility:
    data = data.filter(isOfType(filters.edibility.edibility, "poisonous"));
    // occurrence:
    data = data.filter(containsAny(filters.occurrence.seasons, "season"));
    data = data.filter(containsAny(filters.occurrence.habitats, "habitat"));
    // cap:
    data = data.filter(containsAny(filters.cap.shape, "capShape"));
    data = data.filter(containsAny(filters.cap.color, "capColor"));
    // stem:
    data = data.filter(containsAny(filters.stem.color, "stemColor"));
    data = data.filter(isOfType(filters.stem.hasRing, "hasRing"));
    data = data.filter(containsAny(filters.stem.ringType, "ringType"));
    return data;
  });

  const resetToDefault = () => {
    Object.assign(filters, structuredClone(defaultOptions));
  };

  return { resetToDefault, filterOptions: filters, data };
});

const isOfType = (type, prop) => {
  if (type === -1) return (m) => m;
  return (mushroom) => {
    return Boolean(type) !== mushroom[prop];
  };
};

const containsAny = (contents, prop) => {
  return (mushroom) => {
    return mushroom[prop].some((p) => contents.includes(p));
  };
};

export default useMushroomStore;
