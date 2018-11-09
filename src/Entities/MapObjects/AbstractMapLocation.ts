import { MilitaryBaseTypes } from "../WorldObjects/Bases/MilitaryBaseTypes";
import { PopulationAreaTypes } from "../WorldObjects/PopulationCenters/PopulationAreaTypes";
import { RuralArea } from "../WorldObjects/PopulationCenters/Rural";


export abstract class AbstractMapLocation {
    
    public Contents: MilitaryBaseTypes | PopulationAreaTypes | RuralArea | null;

    constructor() {
        this.Contents = null;
    }
}
