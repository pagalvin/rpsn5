import { AbstractPopulationArea } from "./AbstractPopulationArea";
import { PopulationAreaTypeLabels } from "./PopulationAreaTypes";

export class City extends AbstractPopulationArea {

    public readonly WorldObjectLabel: PopulationAreaTypeLabels = "City";

    constructor(args: {name: string, population: number}) {
        super();

        this.Name = args.name;
        this.Population = args.population;
    }
}
