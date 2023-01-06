import filterOptions from "@/data/filterOptions";
import { reactive } from "vue";

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

export const resetFilters = () => {
  Object.assign(filters, structuredClone(defaultFilters));
};

export const filters = reactive(structuredClone(defaultFilters));

export default { filters, resetFilters };
