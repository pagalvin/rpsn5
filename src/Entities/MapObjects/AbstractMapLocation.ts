import { MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

export abstract class AbstractMapLocation {
    
    abstract Contents: MilitaryBaseTypes | PopulationAreaTypes;
    
    public isTargeted: boolean = false;

    constructor() {
        // this.Contents = null;
    }
}
