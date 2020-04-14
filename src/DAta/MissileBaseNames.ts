import { GameLogic } from "../Game/GameLogic";

export class MissileBaseNames {

    static genericBaseCounter: number = 0;

    static availableMissileBaseNames: string[] = [
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

    public static getMissileBaseName(): string {
        
        if (MissileBaseNames.availableMissileBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: MissileBaseNames.availableMissileBaseNames });
            MissileBaseNames.availableMissileBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Missile Base ${++MissileBaseNames.genericBaseCounter}`;
        }
    }

}
