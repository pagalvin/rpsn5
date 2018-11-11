import { PopulationAreaTypeLabels } from "./PopulationAreaTypes";

export interface PopulationAreaProperties {
    Name: string;
    Population: number;
    WorldObjectLabel: PopulationAreaTypeLabels;
}


export abstract class AbstractPopulationArea implements PopulationAreaProperties {

    public Name: string;
    public Population: number;
    abstract WorldObjectLabel: PopulationAreaTypeLabels;

    constructor() {
        this.Name = "";
        this.Population = 0;
    }

}