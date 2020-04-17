import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class RadarBaseNamesFactory extends AbstractBaseNameFactory{

    computerPrefix = "R";
    
    availableBaseNames: string[] = [
        "Hertz",
        "Maxwell",
        "Hülsmeyer",
        "Marconi",
        "Franklin",
        "Watt",
        "Tizard",
        "Wimperis",
        "Wilkins",
        "Bowan",
        "Rowe",
        "Lindemann",
        "Dowding",
        "Randall",
        "Boot",
        "Lewis",
        "Butement",
        "Pollard",
        "Worlledge",
        "Paris",
        "Erbslöh",
        "Willisen",
        "Hollmann",
        "Schultes",
        "Taylor",
        "Young",
        "Hyland",
        "Breit",
        "Tuve",
        "Page",
        "Popov",
        "Oshchepkov",
        "Lobanov"
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new RadarBaseNamesFactory();
        }
        return this.instance;
    }

}
 