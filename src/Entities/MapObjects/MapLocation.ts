import { AbstractMapLocation } from "./AbstractMapLocation";
import { PlaceableObject } from "./PlaceableObjects";
import { AbstractMilitaryBase } from "../WorldObjects/Bases/AbstractMilitaryBase";
import { AbstractPopulationArea } from "../WorldObjects/PopulationCenters/AbstractPopulationArea";
import { RuralArea } from "../WorldObjects/PopulationCenters/Rural";
import { MilitaryBaseTypeLabels } from "../WorldObjects/Bases/MilitaryBaseTypes";

export class MapLocation extends AbstractMapLocation {

    public Contents: AbstractMilitaryBase | AbstractPopulationArea;
    public uniqueID: number = 0;

    private static nextID: number = 1;

    constructor() {
        super();
        this.Contents = new RuralArea({name: "Empty", population: 0});
        this.uniqueID = MapLocation.nextID++;
    }

    public placeItem(args: {itemToPlace: PlaceableObject}): void {
        this.Contents = args.itemToPlace;
    }
    
    public isMilitaryBase() {

        const militaryLabels: MilitaryBaseTypeLabels[] = [
            "ABM", "Air", "Army", "Missile", "Navy", "Radar"
        ];

        return militaryLabels.filter(ml => ml === this.Contents.WorldObjectLabel).length > 0;
    }
}