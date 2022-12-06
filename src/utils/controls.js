const numericalProperties = [
  { id: 0, displayName: "Min. Cap Diameter", propName: "minCapDiameter" },
  { id: 1, displayName: "Max. Cap Diameter", propName: "maxCapDiameter" },
  { id: 2, displayName: "Min. Stem Height", propName: "minStemHeight" },
  { id: 3, displayName: "Max. Stem Height", propName: "maxStemHeight" },
  { id: 4, displayName: "Min. Stem Width", propName: "minStemWidth" },
  { id: 5, displayName: "Max. Stem Width", propName: "maxStemWidth" },
];

const categoricalProperties = [
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
export { numericalProperties, categoricalProperties };
