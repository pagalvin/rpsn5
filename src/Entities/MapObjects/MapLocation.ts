import { AbstractMapLocation } from "./AbstractMapLocation";
import { PlaceableObject } from "./PlaceableObjects";
import { RuralArea } from "../WorldObjects/PopulationCenters/Rural";
import { MilitaryBaseTypeLabels, MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";
import { CountryMap } from "../WorldObjects/CountryMap";

export class MapLocation extends AbstractMapLocation {
 
    public Contents: MilitaryBaseTypes | PopulationAreaTypes;
    public uniqueID: number = 0;
    
    public nuclearStrikes: number;
    public myMap: CountryMap;
    private static nextID: number = 1;
    public population: number;

    constructor(args: {onMap: CountryMap}) {
        super();
        this.Contents = new RuralArea({name: "Empty", population: 0});
        this.uniqueID = MapLocation.nextID++;
        this.isTargeted = false;
        this.nuclearStrikes = 0;
        this.myMap = args.onMap;
        this.population = 0;
    }

    public placeItem(args: {itemToPlace: PlaceableObject}): void {
        this.Contents = args.itemToPlace;
        
        const {itemToPlace} = args;

        if (itemToPlace && 
                (itemToPlace.WorldObjectLabel === "City" || 
                 itemToPlace.WorldObjectLabel === "Town"))
        {
            this.enemyVisibility = 100;
        }

    }
    
    public isMilitaryBase() {

        const militaryLabels: MilitaryBaseTypeLabels[] = [
            "ABM", "Air", "Army", "Missile", "Navy", "Radar"
        ];

        return militaryLabels.filter(ml => this.Contents !== null &&  ml === this.Contents.WorldObjectLabel).length > 0;
    }
}