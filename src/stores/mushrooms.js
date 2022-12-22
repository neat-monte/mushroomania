import { reactive, computed } from "vue";
import { defineStore } from "pinia";

import mushroomData from "@/data/mushroom-data.json";
import filterOptions from "@/data/filterOptions";

const defaultOptions = {
  search: {
    family: null,
    name: null,
  },
  edibility: {
    edibility: -1,
  },
  occurrence: {
    seasons: filterOptions.occurrence.seasons.map((s) => s.value),
    isSeasonsStrict: false,
    habitats: filterOptions.occurrence.habitats.map((h) => h.value),
    isHabitatsStrict: false,
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
  const families = [...new Set(mushroomData.map((m) => m.family))];
  const names = mushroomData.map((m) => m.name);
  const filters = reactive(structuredClone(defaultOptions));

  const data = computed(() => {
    let data = mushroomData;
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

  const resetToDefault = () => {
    Object.assign(filters, structuredClone(defaultOptions));
  };

  return {
    families,
    names,
    filterOptions: filters,
    data,
    resetToDefault,
  };
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

const containsAll = (contents, prop) => {
  return (mushroom) => {
    return (
      mushroom[prop].length === contents.length &&
      mushroom[prop].every((p) => contents.includes(p))
    );
  };
};

export default useMushroomStore;
