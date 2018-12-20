import { Rng } from "../Utils/Rng";

export class GameData {


    private static readonly allComputerNames = [
        "The Engine",
        "Games Machine",
        "Joe",
        "MARAX",
        "EPICAC",
        "EMSIAC",
        "The Prime Radiant",
        "Mark V",
        "Karl",
        "Mimi",
        "Gold",
        "Bossy",
        "The City Fathers",
        "Multivac",
        "The Central Computer",
        "Vulcan 2",
        "Vulcan 3",
        "Great Coordinator",
        "Merlin",
        "GENiE",
        "Colossus",
        "Guardian",
        "Frost",
        "The Ox",
        "Supreme",
        "ZORAC",
        "Deep Thought",
        "Ghostwheel",
        "Com Pewter",
        "Mother",
        "C Cube",
        "Glooper",
        "Lobsang",
        "Hal"
    ];

    
    public static getRandomComputerName(): string {
        return Rng.pickRandomFromArray({ sourceArray: this.allComputerNames });
    }

}