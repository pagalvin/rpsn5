import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { Ordnance } from "../Entities/Ordnance";

export abstract class AbstractPlayer {

    abstract Name: string;
    abstract map: CountryMap;
    abstract declaredWar: boolean;
    
    abstract totalFunctionalPassiveRadarStations: number;
    abstract totalFunctionalActiveRadarStations: number;
    
    abstract totalPopulationDied: number;

    public allTargetedOrdnanceItems: Ordnance[];
    public ordnanceItemsArrivingThisTick: Ordnance[];

    public isHuman: boolean;

    constructor(args: {isHuman: boolean}) {
        this.isHuman = args.isHuman;
        this.allTargetedOrdnanceItems = [];
        this.ordnanceItemsArrivingThisTick = []; // these are arriving this tick
    }
}