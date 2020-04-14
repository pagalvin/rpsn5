import { GameLogic } from "../Game/GameLogic";

export class NavyBaseNames {

    static gericBaseCounter: number = 0;

    static availableNavyBaseNames: string[] = [

        "Wahoo",
        "Triton",
        "George Washington",
        "Ethan Allen",
        "Nautilus",
        "Turtle",
        "Plongeur",
        "Drebbel",
        "Das Boot",
        "Red October",
        "Yellow",
        "Seaview",
        "SHADO",
        "Cetacean",
        "seaQuest",
        "Sword",
        "Iron Fish",
        "Hydronaut",
        "Supercar",
        "Stingray",
        "Thunderbird",
        "Leif Eriskson",
        "Sea Tiger",
        "Blue Sumbarine No 6",
        "Proteus",
        "Wonder",
        "Jetmarine",
        "Fenian Ram S1881",
        "Gotengo",
        "Voyager",
        "Rorqual Maaru",
        "Sea Trench",
        "Ulysses",
        "UX",
        "Vorpal Blade",
        "I-507"
    ];

    public static getNavyBaseName(): string {

        if (NavyBaseNames.availableNavyBaseNames.length > 0) {
            const getNameResult = GameLogic.getNameForNameableItem({ fromNamesArr: NavyBaseNames.availableNavyBaseNames });
            NavyBaseNames.availableNavyBaseNames = getNameResult.allOtherNames;
            return getNameResult.baseName;
        }
        else {
            return `Generic Navy Base ${++NavyBaseNames.gericBaseCounter}`;
        }
    }

}
