import { AbstractPopulationArea } from "./AbstractPopulationArea";
import { PopulationAreaTypeLabels } from "./PopulationAreaTypes";

export class MajorTown extends AbstractPopulationArea {

    public readonly WorldObjectLabel: PopulationAreaTypeLabels = "Town";

    constructor(args: {name: string, population: number}) {
        super();

        this.Name = args.name;
        this.Population = args.population;
    }
}
