import { ComputerPlayer } from "../Game/ComputerPlayer";

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

    private constructor() {
        super();

        this.computerPlayer = new ComputerPlayer();
        
    }

    public static getInstance() {
        if (! this.instance) {
            this.instance = new Game();
        }

        return this.instance;
    }

}