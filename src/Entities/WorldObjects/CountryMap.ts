import { AbstractMapLocation } from "../MapObjects/AbstractMapLocation";
import { RuralArea } from "./PopulationCenters/Rural";
import { PopulationAreaFactory } from "../../Factories/PopulationAreaFactory";
import { MapLocation } from "../MapObjects/MapLocation";
import { MilitaryBaseTypes } from "./Bases/MilitaryBaseTypes";

export class CountryMap {

    private sizeX: number;
    private sizeY: number;
    private owner: string; // mostly for debug purposes
    public map: MapLocation[][]

    private readonly newRuralArea = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "Rural"});

    constructor(args: {sizeX: number, sizeY: number, owner: string}) {

        this.sizeX = args.sizeX;
        this.sizeY = args.sizeY;
        this.map = [[]];
        this.owner = args.owner;
        this.initializeMap();
    }

    public logDetailedMapToConsole() {

        console.log(`WorldMap.ts: logSelfToConsole: logging map:`, {map: this.map});
        
        for (let i = 0; i < this.map.length; i++) {
            console.table(this.map[i]);
        }
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

    public getAllMilitaryBases(): Exclude<MilitaryBaseTypes, null>[] {
        
        const baseLocationsInRow = (mapRow: MapLocation[]) => mapRow.filter(mapCell => mapCell.isMilitaryBase());

        const bases = this.map.map(mapRow => baseLocationsInRow(mapRow).map(mapRow => mapRow.Contents) as MilitaryBaseTypes[]);

        var flattendedBases = [].concat.apply([], bases) as Exclude<MilitaryBaseTypes, null>[];

        return flattendedBases;

    }
}