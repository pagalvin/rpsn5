import { AbstractPlayer } from "./AbstractPlayer";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";

export class HumanPlayer extends AbstractPlayer  {
    
    public declaredWar: boolean;
    public Name: string;
    public map: CountryMap;

    constructor() {
        super();

        this.map = new CountryMap({sizeX: 10, sizeY: 10, owner: "Human"});
        this.Name = "Human";
        this.declaredWar = false;
    }

}