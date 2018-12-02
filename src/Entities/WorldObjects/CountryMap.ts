import { PopulationAreaFactory } from "../../Factories/PopulationAreaFactory";
import { MapLocation } from "../MapObjects/MapLocation";
import { MilitaryBaseTypes } from "./Bases/MilitaryBaseTypes";
import { AbstractPlayer } from "../../Game/AbstractPlayer";
import { AbmBase } from "./Bases/AbmBase";
import { Rng } from "../../Utils/Rng";

export class CountryMap {

    private sizeX: number;
    private sizeY: number;
    public owner: "Computer" | "Human";
    public map: MapLocation[][]
    public owningPlayer: AbstractPlayer;

    private readonly newRuralArea = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "Rural"});

    constructor(args: {sizeX: number, sizeY: number, ownerLabel: "Computer" | "Human", owningPlayer: AbstractPlayer}) {

        this.sizeX = args.sizeX;
        this.sizeY = args.sizeY;
        this.map = [[]];
        this.owner = args.ownerLabel;
        this.owningPlayer = args.owningPlayer;

        this.initializeMap();

    }

    public logDetailedMapToConsole() {

        console.log(`WorldMap.ts: logSelfToConsole: logging map:`, {map: this.map});
        
        for (let i = 0; i < this.map.length; i++) {
            console.table(this.map[i]);
        }
    }

    private initializeMap() {

        console.log(`CountryMap: initializeMap: Entering, my sizex/sizey:`, this.sizeX, this.sizeY, this.owner);

        // First, create sizeX by sizeY  collection of negligble population centers
        for (let x = 0; x < this.sizeX; x++) {

            this.map.push([]);

            for (let y = 0; y < this.sizeY; y++) {

                const mi = new MapLocation({onMap: this});
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

    public getAllABMBases(): AbmBase[] {
        return this.getAllMilitaryBases().filter(b => b.WorldObjectLabel === "ABM") as AbmBase[];
    }

    public getRandomLocation() {
        const x = Rng.throwDice({hiNumberMinus1: this.map.length - 1});
        const y = Rng.throwDice({hiNumberMinus1: this.map.length - 1});

        return (
            this.map[x][y]
         );
    }
}