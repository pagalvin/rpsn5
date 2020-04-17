import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class AirBaseNamesFactory extends AbstractBaseNameFactory {

    computerPrefix = "B";
    
    availableBaseNames: string[] = [
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new AirBaseNamesFactory();
        }
        return this.instance;
    }

}
