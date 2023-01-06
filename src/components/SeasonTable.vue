<template>
  <v-table id="season-table" fixed-header height="100%">
    <thead>
      <tr>
        <th
          class="text-left family"
          @click="onSort(0, 'family')"
          :priority="sortPriority.indexOf('family')"
          :direction="sortDirectionsAreDescending['family'] ? 'down' : 'up'"
        >
          Family
        </th>
        <th
          class="text-left name"
          @click="onSort(0, 'name')"
          :priority="sortPriority.indexOf('name')"
          :direction="sortDirectionsAreDescending['name'] ? 'down' : 'up'"
        >
          Name
        </th>
        <th
          class="text-center"
          @click="onSort(0, 'seasonValue')"
          :priority="sortPriority.indexOf('seasonValue')"
          :direction="
            sortDirectionsAreDescending['seasonValue'] ? 'down' : 'up'
          "
        >
          {{ header[0].name }}
        </th>
        <th class="text-center" @click="onSort(1, 'seasonValue')">
          {{ header[1].name }}
        </th>
        <th class="text-center" @click="onSort(2, 'seasonValue')">
          {{ header[2].name }}
        </th>
        <th class="text-center" @click="onSort(3, 'seasonValue')">
          {{ header[3].name }}
        </th>
      </tr>
    </thead>
    <tbody class="table-body">
      <tr
        v-for="item in sortedData"
        :key="item.name"
        :class="`
          ${mushroomStore.isSelectedMushroom(item) ? 'selected' : ''} 
          ${mushroomStore.isHighlightedMushroom(item) ? 'highlighted' : ''}
        `"
        @click.exact.stop="mushroomStore.setSelectedMushroom(item)"
        @click.shift.stop="
          mushroomStore.setHighlightedMushroomsArray(
            [item],
            true,
            mushroomStore.isHighlightedMushroom(item)
          )
        "
      >
        <td>{{ item.family }}</td>
        <td>{{ item.name }}</td>
        <td
          :class="header[0].class"
          :available="item.season.includes(header[0].id)"
        ></td>
        <td
          :class="header[1].class"
          :available="item.season.includes(header[1].id)"
        ></td>
        <td
          :class="header[2].class"
          :available="item.season.includes(header[2].id)"
        ></td>
        <td
          :class="header[3].class"
          :available="item.season.includes(header[3].id)"
        ></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();

const defaultHeader = [
  { name: "Spring", class: "spring", id: "s" },
  { name: "Summer", class: "summer", id: "u" },
  { name: "Autumn", class: "autumn", id: "a" },
  { name: "Winter", class: "winter", id: "w" },
];
//The order used for sorting on a specific season.
const sortOrder = {
  //First all mushrooms in the season
  1000: 0,
  //Then all mushrooms in the season + another
  1100: 1,
  1010: 2,
  1001: 3,
  //Then all mushrooms in the season + 2 others
  1110: 4,
  1101: 5,
  1011: 6,
  //Undefined behaviour
  1111: 7,
  //Undefined behaviour
  "0111": 8,
  //Undefined behaviour
  "0110": 9,
  "0101": 10,
  "0011": 11,
  //Undefined behaviour
  "0100": 12,
  "0010": 13,
  "0001": 14,
  //Lastly all mushrooms with no seasons
  "0000": 15,
};
// The order in which to sort rows, default is sort on family first, then name and lastly seasonValue.
const sortPriority = reactive(["seasonValue", "family", "name"]);
// The sort directions of each column, decreasing if true, increasing if false
const sortDirectionsAreDescending = reactive({
  family: true,
  name: true,
  seasonValue: true,
});

const sortedData = computed(() => {
  let sortedData = mushroomStore.data.map((e) => {
    e.sortArray = getSortArray(e);

    //Update the order of the sortArrays
    cycleArray(e.sortArray, seasonIndex.value);

    e.seasonValue = getValueForSort(e);
    return e;
  });

  //Update the order of all elements
  sortedData.sort(function (a, b) {
    // First sort on highest priority in the chosen direction
    if (a[sortPriority[0]] !== b[sortPriority[0]]) {
      if (sortDirectionsAreDescending[sortPriority[0]])
        return a[sortPriority[0]] > b[sortPriority[0]] ? 1 : -1;
      return a[sortPriority[0]] < b[sortPriority[0]] ? 1 : -1;
    }
    // Secondary sort on second highest priority in the chosen direction
    if (a[sortPriority[1]] !== b[sortPriority[1]]) {
      if (sortDirectionsAreDescending[sortPriority[1]])
        return a[sortPriority[1]] > b[sortPriority[1]] ? 1 : -1;
      return a[sortPriority[1]] < b[sortPriority[1]] ? 1 : -1;
    }
    //Tertiary sort on lowest priority in the chosen direction
    if (sortDirectionsAreDescending[sortPriority[2]])
      return a[sortPriority[2]] > b[sortPriority[2]] ? 1 : -1;
    return a[sortPriority[2]] < b[sortPriority[2]] ? 1 : -1;
  });

  return sortedData;
});

const header = reactive(defaultHeader);

const seasonIndex = ref(0);

function onSort(index, target) {
  //Find the priority of the target column
  const priority = sortPriority.indexOf(target);
  if (priority == 0) {
    // If already highest priority, change direction of the target
    // if (target != "seasonValue" ) // Possibility to exclude season sorting as increasing, sorting it always as decreasing
    // Only change direction if we are not changing the season
    if (index == 0)
      sortDirectionsAreDescending[target] =
        !sortDirectionsAreDescending[target];
  } else {
    // If not highest priority, move to the front so it is
    sortPriority.splice(priority, 1);
    sortPriority.unshift(target);
  }

  seasonIndex.value = (seasonIndex.value + index) % 4;

  //Update the order of the header
  cycleArray(header, index);
}

//Cycles an array k times, takes the first element and moves it to the end.
function cycleArray(array, k) {
  for (let i = 0; i < k; i++) {
    array.push(array.shift());
  }
}
// Returns an array representing when mushrooms are available.
function getSortArray(element) {
  return [
    element.season.includes("s"),
    element.season.includes("u"),
    element.season.includes("a"),
    element.season.includes("w"),
  ];
}
// Returns the value used for sorting the elements using an object containing a predefined order.
function getValueForSort(element) {
  let string = element.sortArray.map((i) => i + 0).join("");
  return sortOrder[string];
}
</script>

<style lang="sass" scoped>
$spring:        #D4E09B
$spring-summer: #EACC4E
$summer:        #FFB700
$summer-autumn: #DE9213
$autumn:        #BC6C25
$autumn-winter: #AF9F92
$winter:        #A2D2FF
$winter-spring: #BBD9CD
$startperc:     10%
$endperc:       90%


#season-table
  --v-theme-surface: transparent
  height: 100%
  border-radius: 4px

  .family
    width: 18em
  .name
    width: 18em

  th
    background: rgb(var(--v-theme-background))

    &[priority]
      padding-right: 10px

    &.arrow
      content: ' '
      position: relative
      left: 2px
      border: 5px solid transparent

    &[priority="0"]
      &:after
        @extend .arrow
      &[direction="up"]:after
        bottom: 10px
        border-bottom-color: rgb(var(--v-theme-gray-level-0))
      &[direction="down"]:after
        top: 10px
        border-top-color: rgb(var(--v-theme-gray-level-0))

    &[priority="1"]
      &:after
        @extend .arrow
      &[direction="up"]:after
        bottom: 10px
        border-bottom-color: rgb(var(--v-theme-gray-level-1))
      &[direction="down"]:after
        top: 10px
        border-top-color: rgb(var(--v-theme-gray-level-1))

    &[priority="2"]
      &:after
        @extend .arrow
      &[direction="up"]:after
        bottom: 10px
        border-bottom-color: rgb(var(--v-theme-gray-level-2))
      &[direction="down"]:after
        top: 10px
        border-top-color: rgb(var(--v-theme-gray-level-2))

  tr
    &:hover
      cursor: pointer
      background-color: rgba(var(--v-theme-accent-lighten-2), 0.5) !important

    &.highlighted
      background-color: rgba(var(--v-theme-secondary), .5)

    &.selected
      color: rgb(var(--v-theme-accent))
      background-color: rgba(var(--v-theme-accent-lighten-2), .5)
      font-weight: 600

    td
      &.season
        &[available=true]
          margin: 0
          padding: 0

          &:after
            content: ""
            display: block
            width: 100%
            height: 1.1rem

      &.spring
        @extend .season
        &:after
          background: linear-gradient(0.25turn, $winter-spring, $startperc, $spring, $endperc, $spring-summer)
      &.summer
        @extend .season
        &:after
          background: linear-gradient(0.25turn, $spring-summer, $startperc, $summer, $endperc, $summer-autumn)
      &.autumn
        @extend .season
        &:after
          background: linear-gradient(0.25turn, $summer-autumn, $startperc, $autumn, $endperc, $autumn-winter)
      &.winter
        @extend .season
        &:after
          background: linear-gradient(0.25turn, $autumn-winter, $startperc, $winter, $endperc, $winter-spring)
</style>
