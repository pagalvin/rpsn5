import { MilitaryBaseTypes, MilitaryBaseTypeLabels } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes, PopulationAreaTypeLabels } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";

export abstract class AbstractMapLocation {
    
    abstract Contents: MilitaryBaseTypes | PopulationAreaTypes;
    
    constructor() {
        // this.Contents = null;
    }
}
