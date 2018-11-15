import { MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

export abstract class AbstractMapLocation {
    
    abstract Contents: MilitaryBaseTypes | PopulationAreaTypes;
     
    constructor() {
        // this.Contents = null;
    }
}
