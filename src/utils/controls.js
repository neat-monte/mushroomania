export const numericalProperties = [
  { name: "Min. Cap Diameter", prop: "minCapDiameter" },
  { name: "Max. Cap Diameter", prop: "maxCapDiameter" },
  { name: "Min. Stem Height", prop: "minStemHeight" },
  { name: "Max. Stem Height", prop: "maxStemHeight" },
  { name: "Min. Stem Width", prop: "minStemWidth" },
  { name: "Max. Stem Width", prop: "maxStemWidth" },
];

export const categoricalProperties = [
  {displayName: "Ediblity", propName: "poisonous", values: 
    {true: "Edible", false: "Non-edible"}},
  {displayName: "Damage", propName: "doesBruiseOrBleed", values: 
    {true: "Visbile", false: "Invisible"}},
  {displayName: "Ring", propName: "hasRing", values: 
    {true: "One or more", false: "No ring"}},
  {displayName: "Habitat", propName: "habitat", values: 
    {g:"Grasses",l:"Leaves",m:"Meadows",p:"Paths",h:"Heaths",u:"Urban"
    ,w:"Waste",d:"Woods"}},
  {displayName: "Season", propName: "season", values: 
    {s:"Spring",u:"Summer",a:"Autumn",w:"Winter"}},
  {displayName: "Cap Shape", propName: "capShape", values: 
    {b:"Bell",c:"Conical",x:"Convex",f:"Flat",s:"Sunken",p:"Spherical",o:"Others"}},
  {displayName: "Cap Color", propName: "capColor", values:
    {n:"Brown", b:"Buff", g:"Gray",r:"Green",p:"Pink",u:"Purple",e:"Red",w:"White"
    ,y:"Yellow",l:"Blue",o:"Orange",k:"Black"}},
  {displayName: "Gill Color", propName: "gillColor", values:
    {n:"Brown", b:"Buff", g:"Gray",r:"Green",p:"Pink",u:"Purple",e:"Red",w:"White"
    ,y:"Yellow",l:"Blue",o:"Orange",k:"Black",f:"None"}},
  {displayName: "Stem Color", propName: "stemColor", values:
    {n:"Brown", b:"Buff", g:"Gray",r:"Green",p:"Pink",u:"Purple",e:"Red",w:"White"
    ,y:"Yellow",l:"Blue",o:"Orange",k:"Black",f:"None"}},
  {displayName: "Ring Type", propName: "ringType", values:
    {c:"Cobwebby",e:"Evanescent",r:"Flaring",g:"Grooved",l:"Large",p:"Pendant",s:"Sheathing"
    ,z:"Zone",y:"Scaly",m:"Movable",f:"None",'?':"Unknown"}},
];

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
};

export const filterOptions = {
  edibility: edibilityFilterOptions,
  occurrence: occurrenceFilterOptions,
  cap: capFilterOptions,
};

export default {
  numericalProperties,
  categoricalProperties,
  filterOptions,
};
