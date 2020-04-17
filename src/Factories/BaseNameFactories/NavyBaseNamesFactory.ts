import { GameLogic } from "../../Game/GameLogic";
import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class NavyBaseNamesFactory extends AbstractBaseNameFactory {

      computerPrefix = "S";
      
      availableBaseNames: string[] = [
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

    public static getInstance() {
      if (! this.instance) {
          this.instance = new NavyBaseNamesFactory();
      }
      return this.instance;
  }

}
