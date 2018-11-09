import { AbstractMapLocation } from "../MapObjects/AbstractMapLocation";
import { RuralArea } from "./PopulationCenters/Rural";
import { PopulationAreaFactory } from "../../Factories/PopulationAreaFactory";
import { MapLocation } from "../MapObjects/MapLocation";

export class CountryMap {

    private sizeX: number;
    private sizeY: number;

    private map: AbstractMapLocation[][]

    private readonly newRuralArea = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "Rural"});

    constructor(args: {sizeX: number, sizeY: number}) {

        this.sizeX = args.sizeX;
        this.sizeY = args.sizeY;
        this.map = [[]];

        this.initializeMap();
    }

    private initializeMap() {

        // First, create sizeX by sizeY  collection of negligble population centers
        for (let x = 0; x < this.sizeX; x++) {

            this.map.push([]);
            
            for (let y = 0; y < this.sizeY; y++) {

                const mi = new MapLocation();
                mi.Contents = this.newRuralArea();

                this.map[x].push(mi);
            }
        }
    }

}