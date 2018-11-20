import { AbstractMapLocation } from "./AbstractMapLocation";
import { PlaceableObject } from "./PlaceableObjects";
import { RuralArea } from "../WorldObjects/PopulationCenters/Rural";
import { MilitaryBaseTypeLabels, MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

export class MapLocation extends AbstractMapLocation {
 
    public Contents: MilitaryBaseTypes | PopulationAreaTypes;
    public uniqueID: number = 0;
    
    public nuclearStrikes: number;

    private static nextID: number = 1;

    constructor() {
        super();
        this.Contents = new RuralArea({name: "Empty", population: 0});
        this.uniqueID = MapLocation.nextID++;
        this.isTargeted = false;
        this.nuclearStrikes = 0;
        
    }

    public placeItem(args: {itemToPlace: PlaceableObject}): void {
        this.Contents = args.itemToPlace;
    }
    

    public isMilitaryBase() {

        const militaryLabels: MilitaryBaseTypeLabels[] = [
            "ABM", "Air", "Army", "Missile", "Navy", "Radar"
        ];

        return militaryLabels.filter(ml => this.Contents !== null &&  ml === this.Contents.WorldObjectLabel).length > 0;
    }
}