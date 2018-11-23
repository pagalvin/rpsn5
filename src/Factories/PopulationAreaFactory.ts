import { AbstractPopulationArea } from "../Entities/WorldObjects/PopulationCenters/AbstractPopulationArea";
import { PopulationAreaTypeLabels } from "../Entities/WorldObjects/PopulationCenters/PopulationAreaTypes";
import { City } from "../Entities/WorldObjects/PopulationCenters/City";
import { RuralArea } from "../Entities/WorldObjects/PopulationCenters/Rural";
import { MajorTown } from "../Entities/WorldObjects/PopulationCenters/MajorTown";
import { Rng } from "../Utils/Rng";

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

        console.log(`PopulationAreaFactory: Entering, creating a pop area:`, args.popAreaType);
        
        switch(args.popAreaType) {

            case "City": {
                const newPopulationArea = new City({
                    name: "xyzzy",
                    population: Rng.throwDice({hiNumberMinus1: 6500000}) + 6000000
                });
                return newPopulationArea;
            }
            
            case "Rural": {
                const newPopulationArea = new RuralArea({
                    name: "xyzzy",
                    population: Rng.throwDice({hiNumberMinus1: 1000}) + 1000
                });
                return newPopulationArea;
            }
            
            case "Town": {
                const newPopulationArea = new MajorTown({
                    name: "xyzzy",
                    population: Rng.throwDice({hiNumberMinus1: 50000}) + 10000
                });
                return newPopulationArea;
            }
            
        }

        return new RuralArea({name: "Error", population: -1})
    }

}