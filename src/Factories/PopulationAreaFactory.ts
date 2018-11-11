import { AbstractPopulationArea } from "../Entities/WorldObjects/PopulationCenters/AbstractPopulationArea";
import { PopulationAreaTypeLabels } from "../Entities/WorldObjects/PopulationCenters/PopulationAreaTypes";
import { City } from "../Entities/WorldObjects/PopulationCenters/City";
import { RuralArea } from "../Entities/WorldObjects/PopulationCenters/Rural";
import { MajorTown } from "../Entities/WorldObjects/PopulationCenters/MajorTown";

export class PopulationAreaFactory {

    private static instance: PopulationAreaFactory;

    private readonly msh = "PopulationAreaFactory: ";

    private nextPopulationAreaID: number = 0;

    constructor() {
        
    }

    public static getInstance() : PopulationAreaFactory {

        if (!this.instance) {
            this.instance = new PopulationAreaFactory();
        }

        return this.instance;
    }

    private newName(args: {forPopulationArea: AbstractPopulationArea}) {
        console.log(`${this.msh}: newName: typeof base:`, args.forPopulationArea.WorldObjectLabel);
        return 'xyzzy';
    }

    public createNewPopulationArea(args: {popAreaType: PopulationAreaTypeLabels}) {

        switch(args.popAreaType) {

            case "City": {
                const newPopulationArea = new City({
                    name: "xyzzy",
                    population: 999
                });
                return newPopulationArea;
            }
            
            case "Rural": {
                const newPopulationArea = new RuralArea({
                    name: "xyzzy",
                    population: 999
                });
                return newPopulationArea;
            }
            
            case "Town": {
                const newPopulationArea = new MajorTown({
                    name: "xyzzy",
                    population: 999
                });
                return newPopulationArea;
            }
            
        }

        return null;

    }

}