import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { Ordnance } from "../Entities/Ordnance";

export abstract class AbstractPlayer {

    abstract Name: string;
    abstract map: CountryMap;
    abstract declaredWar: boolean;
    
    abstract totalFunctionalPassiveRadarStations: number;
    abstract totalFunctionalActiveRadarStations: number;
    
    public targetedOrdnanceItems: Ordnance[];

    public isHuman: boolean;

    constructor(args: {isHuman: boolean}) {
        this.isHuman = args.isHuman;
        this.targetedOrdnanceItems = [];
    }
}