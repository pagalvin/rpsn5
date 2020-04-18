import { PopulationAreaFactory } from "../../Factories/PopulationAreaFactory";
import { MapLocation } from "../MapObjects/MapLocation";
import { MilitaryBaseTypes } from "./Bases/MilitaryBaseTypes";
import { AbstractPlayer } from "../../Game/AbstractPlayer";
import { AbmBase } from "./Bases/AbmBase";
import { Rng } from "../../Utils/Rng";
import { Constants } from "../../Game/constants";
import { constants } from "os";

export class CountryMap {

    private sizeX: number;
    private sizeY: number;
    public owner: "Computer" | "Human";
    public map: MapLocation[][]
    public owningPlayer: AbstractPlayer;

    private readonly newRuralArea = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "Rural"});
    private readonly newCity = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "City"});
    private readonly newTown = () => PopulationAreaFactory.getInstance().createNewPopulationArea({popAreaType: "Town"});

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

        const placeTownOrCity = (args: {totalToPlace: number, factoryFunc: Function}) => {

            let totalCitiesOrTownsToPlace = args.totalToPlace;

            while (totalCitiesOrTownsToPlace > 0) {

                const tryX = Rng.throwDice({hiNumberMinus1: this.sizeX - 1});
                const tryY = Rng.throwDice({hiNumberMinus1: this.sizeY - 1});

                const mi: MapLocation = this.map[tryX][tryY];

                if (mi.Contents.WorldObjectLabel === "Rural") {
                    totalCitiesOrTownsToPlace --;
                    mi.Contents = args.factoryFunc();
                }
            }
        }

        // Place cities.
        placeTownOrCity({
            totalToPlace: Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_CITIES - Constants.MIN_INITIAL_CITIES}) + Constants.MIN_INITIAL_CITIES,
            factoryFunc: this.newCity
        });

        // Place towns
        placeTownOrCity({
            totalToPlace: Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_TOWNS - Constants.MIN_INITIAL_TOWNS}) + Constants.MIN_INITIAL_TOWNS,
            factoryFunc: this.newTown
        });

        // let citiesToPlace: number = Rng.throwDice({hiNumberMinus1: Constants.MAX_INITIAL_CITIES - Constants.MIN_INITIAL_CITIES}) + Constants.MIN_INITIAL_CITIES;

        // while (citiesToPlace > 0) {

        //     const tryX = Rng.throwDice({hiNumberMinus1: this.sizeX - 1});
        //     const tryY = Rng.throwDice({hiNumberMinus1: this.sizeY - 1});

        //     const mi: MapLocation = this.map[tryX][tryY];

        //     if (mi.Contents.WorldObjectLabel === "Rural") {
        //         citiesToPlace --;
        //         mi.Contents = this.newCity();
        //     }

        // }

        
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