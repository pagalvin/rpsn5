import { PopulationAreaTypeLabels } from "./PopulationAreaTypes";

export interface PopulationAreaProperties {
    Name: string;
    Population: number;
    PopulationAreaType: PopulationAreaTypeLabels;
}


export abstract class AbstractPopulationArea implements PopulationAreaProperties {

    public Name: string;
    public Population: number;
    abstract PopulationAreaType: PopulationAreaTypeLabels;

    constructor() {
        this.Name = "";
        this.Population = 0;
    }

}