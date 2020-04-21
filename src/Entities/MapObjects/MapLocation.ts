import { AbstractMapLocation } from "./AbstractMapLocation";
import { PlaceableObject } from "./PlaceableObjects";
import { RuralArea } from "../WorldObjects/PopulationCenters/Rural";
import { MilitaryBaseTypeLabels, MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";
import { CountryMap } from "../WorldObjects/CountryMap";

export class MapLocation extends AbstractMapLocation {

    public Contents!: MilitaryBaseTypes | PopulationAreaTypes;
    public uniqueID: number = 0;

    public nuclearStrikes: number;
    public myMap: CountryMap;
    private static nextID: number = 1;
    private _doesHaveWaterBorder: boolean = false;

    constructor(args: {onMap: CountryMap, doesHaveWaterBorder: boolean}) {
        super();
        this.Contents = new RuralArea({name: "Empty", population: 0});
        this.uniqueID = MapLocation.nextID++;
        this.isTargeted = false;
        this.nuclearStrikes = 0;
        this.myMap = args.onMap;
        this._doesHaveWaterBorder = args.doesHaveWaterBorder;
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

    public doesHaveWaterBorder() : boolean {
        return this._doesHaveWaterBorder;
    }

    public isMilitaryBase() {

        const militaryLabels: MilitaryBaseTypeLabels[] = [
            "ABM", "Air", "Army", "Missile", "Navy", "Radar"
        ];

        return militaryLabels.filter(ml => this.Contents !== null &&  ml === this.Contents.WorldObjectLabel).length > 0;
    }

    public increasePopulation(args: {popModifier: number}) {
        this.Contents.Population += Math.floor(this.Contents.Population *= args.popModifier);

        // console.log(`Increasing population from ${this.Contents.Population} using a modifer of ${args.popModifier}...`);
        // this.Contents.Population *= args.popModifier;
        // this.Contents.Population = Math.floor(this.Contents.Population);
        // console.log(`new population ${this.Contents.Population} using a modifer of ${args.popModifier}...`);
    }
}