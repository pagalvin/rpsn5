import { AbstractPlayer } from "./AbstractPlayer";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { MapUtil } from "../Utils/MapUtils";

export class HumanPlayer extends AbstractPlayer  {
    
    public totalFunctionalPassiveRadarStations: number;
    public totalFunctionalActiveRadarStations: number;
    
    public declaredWar: boolean;
    public Name: string;
    public map: CountryMap;
    public totalCausualties: number = 0;

     constructor() {
        super({isHuman: true});

        this.map = new CountryMap({sizeX: 10, sizeY: 10, ownerLabel: "Human", owningPlayer: this});
        this.Name = "Human";
        this.declaredWar = false;
        this.totalFunctionalActiveRadarStations = 0;
        this.totalFunctionalPassiveRadarStations = 0;
        this.totalCausualties = 0;

        MapUtil.createTestBases({onMap: this.map});
    }

}