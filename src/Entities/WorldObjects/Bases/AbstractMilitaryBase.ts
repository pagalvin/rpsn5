
import { MilitaryBaseTypeLabels } from "./MilitaryBaseTypes";
import { AbstractGameEntity } from "../../gameEntity";

export interface MilitaryBaseProperties {
    Name: string;
    Age: number;
    WorldObjectLabel: MilitaryBaseTypeLabels;
}

export interface MilitaryBasedActions {
    activate: () => void;
}

export abstract class AbstractMilitaryBase extends AbstractGameEntity implements MilitaryBaseProperties, MilitaryBasedActions{

    public Name: string = "";
    public Age: number = 0;

    // Having a "BaseType" label here helps some code work a little more generically since "typeof [any base object]" returns "object"
    // This gives us a shot at treating bases a little more generically. Look at MilitaryBaseFactory.ts for an example.
    public abstract WorldObjectLabel: MilitaryBaseTypeLabels;

    public abstract activate(): void;

    constructor() {
        super();
        this.Age = 1;
    }
    
}
