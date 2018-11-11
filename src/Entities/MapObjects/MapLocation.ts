import { AbstractMapLocation } from "./AbstractMapLocation";
import { PlaceableObject } from "./PlaceableObjects";
import { AbstractMilitaryBase } from "../WorldObjects/Bases/AbstractMilitaryBase";
import { AbstractPopulationArea } from "../WorldObjects/PopulationCenters/AbstractPopulationArea";

export class MapLocation extends AbstractMapLocation {

    public Contents: AbstractMilitaryBase | AbstractPopulationArea | null;

    constructor() {
        super();
        this.Contents = null;
    }

    public placeItem(args: {itemToPlace: PlaceableObject}): void {
        this.Contents = args.itemToPlace;
        
    }
    
}