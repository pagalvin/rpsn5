import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class MissileBaseNamesFactory extends AbstractBaseNameFactory {

    computerPrefix = "M";
    
    availableBaseNames: string[] = [
        "Wernher von Braun",
        "Armstrong",
        "Musk",
        "Cayley",
        "Goddard",
        "Korolev",
        "Chawla",
        "Wallis",
        "Ohain",
        "Mitchell",
        "Crawford Johnson",
        "Amrutkar-Pate",
        "Manypu",
        "Arnold",
        "Korolyov",
        "Gagarin",
        "Ramo",
        "Kryukov",
        "Barmin",
        "Coandă",
        "Heinkel",
        "Horikoshi",
        "Nadiradze",
        "Popov",
        "Rich",
        "Walter",
        "Wendt",
        "Whittle",
        "Wright",
        "Oppenheimer",
        "Einstein",
        "Curie",
        "Rutherford",
        "Soddy",
        "Leó Szilárd",
        "Joliot-Curie",
        "Strassmann",
        "Hahn",
        "Sengier",
        "Bethe"
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new MissileBaseNamesFactory();
        }
        return this.instance;
    }

}
