import { AbstractBaseNameFactory } from "./AbstractBaseNameFactory";

export class AbmBaseNameFactory extends AbstractBaseNameFactory  {

    computerPrefix = "A";
    
    availableBaseNames: string[] = [
    ];

    public static getInstance() {
        if (! this.instance) {
            this.instance = new AbmBaseNameFactory();
        }
        return this.instance;
    }

}
