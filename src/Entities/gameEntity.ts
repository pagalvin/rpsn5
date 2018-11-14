import { ComputerPlayer } from "../Game/ComputerPlayer";
import { HumanPlayer } from "../Game/HumanPlayer";
import { CountryMap } from "./WorldObjects/CountryMap";
import { GameLogic } from "../Game/GameLogic";

export interface GameEntity {
    gameYear: number;
}

export abstract class AbstractGameEntity implements GameEntity {
    abstract gameYear: number;
}

export class Game extends AbstractGameEntity {

    private static instance: Game;

    public isPeacetime: boolean = true;
    public isWartime: boolean = false;
    
    public turn: number = 0;
    public get gameYear() { return this.turn + 1944;}
    
    public computerPlayer: ComputerPlayer;
    public humanPlayer: HumanPlayer;
    
    private constructor() {
        super();

        this.computerPlayer = new ComputerPlayer();
        this.humanPlayer = new HumanPlayer();
    }

    public static getInstance() {
        if (! this.instance) {
            this.instance = new Game();
        }

        return this.instance;
    }

    public startGame() {
        
        GameLogic.startClock();
        
        // this.computerPlayer.map = new CountryMap({sizeY: 10, sizeX: 10, owner: "Computer"});
        // this.humanPlayer.map = new CountryMap({sizeX: 10, sizeY: 10, owner: "Human"});
    }
}