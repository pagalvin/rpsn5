import { MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";
import { CountryMap } from "../WorldObjects/CountryMap";

export abstract class AbstractMapLocation {
    
    abstract Contents: MilitaryBaseTypes | PopulationAreaTypes;
    
    public isTargeted: boolean = false;
    abstract myMap: CountryMap;
    abstract population: number;

    constructor() {
        // this.Contents = null;
    }
}
