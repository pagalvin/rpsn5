import { ComputerPlayer } from "../Game/ComputerPlayer";
import { HumanPlayer } from "../Game/HumanPlayer";
import { GameLogic } from "../Game/GameLogic";
import { AbstractPlayer } from "../Game/AbstractPlayer";
import { GameData } from "../Data/ComputerNames";

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
    public currentPlayer: AbstractPlayer;

    private constructor() {
        super();

        this.computerPlayer = new ComputerPlayer();
        this.computerPlayer.Name = GameData.getRandomComputerName();
        this.humanPlayer = new HumanPlayer();
        this.currentPlayer = this.humanPlayer;
    }

    public static getInstance() {
        if (! this.instance) {
            this.instance = new Game();
        }

        return this.instance;
    }

    public startGame() {
        
        GameLogic.startClock();
    }
}