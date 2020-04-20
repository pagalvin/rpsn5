import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class AirBaseNamesFactory extends AbstractBaseNameFactory {

    computerPrefix = "B";
    
    availableBaseNames: string[] = [
        "Lady Hawke",
        "Hugin",
        "Munin",
        "Iago",
        "Matthew",
        "Raven",
        "Hedwig",
        "Phoenix",
        "Owl",
        "Raptor",
        "Elwing",
        "Fawlkes",
        "Jareth",
        "Scuttle",
        "Archimedes",
        "Gwythaint",
        "Thorondor",
        "Reginal Hoopoe",
        "Quoth",
        "Filthy Lucre",
        "Skarlath",
        "Mr. Big",
        "Senu",
        "Nevermore",
        "Crone",
        "Mortimer",
        "Motley",
        "Kehaar"
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new AirBaseNamesFactory();
        }
        return this.instance;
    }

}
