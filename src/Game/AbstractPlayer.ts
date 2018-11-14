import { CountryMap } from "../Entities/WorldObjects/CountryMap";

export abstract class AbstractPlayer {

    abstract Name: string;
    abstract map: CountryMap;
    abstract declaredWar: boolean;
    
}