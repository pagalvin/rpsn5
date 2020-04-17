import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class ArmyBaseNamesFactory extends AbstractBaseNameFactory {

    computerPrefix = "T";
    
    availableBaseNames: string[] = [
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new ArmyBaseNamesFactory();
        }
        return this.instance;
    }

}
