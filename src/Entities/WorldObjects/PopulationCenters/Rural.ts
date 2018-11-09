import { AbstractPopulationArea } from "./AbstractPopulationArea";
import { PopulationAreaTypeLabels } from "./PopulationAreaTypes";

export class RuralArea extends AbstractPopulationArea {

    public readonly PopulationAreaType: PopulationAreaTypeLabels = "Rural";

    constructor(args: {name: string, population: number}) {
        super();

        this.Name = args.name;
        this.Population = args.population;

    }
}
