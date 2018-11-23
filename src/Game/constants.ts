export class Constants {
    
    public static readonly NOTIFY_BUILD_RESULT_CALLBACK_NAME = "rpsn_notifyBuildDragResult";
    public static readonly NOTIFY_TARGET_RESULT_CALLBACK_NAME = "rpsn_notifyTargetResult";

    public static readonly MIN_INITIAL_FIGHTERS = 1;
    public static readonly MAX_INITIAL_FIGHTERS = 4;
    public static readonly MIN_INITIAL_BOMBERS = 1;
    public static readonly MAX_INITIAL_BOMBERS = 4;

    public static readonly MIN_ICBMS = 1;
    public static readonly MAX_ICBMS = 4;

    public static readonly MIN_SUB_MISSILES = 1;
    public static readonly MAX_SUB_MISSILES = 3;

    public static readonly BUILD_DROP = "build";
    public static readonly TARGET_MISSILE_DROP = "target";

    // The theory is that first strike is devastating, second strike less so and by 3rd strike, survivors are spread out and more likely to survive
    public static readonly FIRST_STRIKE_POPULATION_HIT_PCT = 0.90;
    public static readonly SECOND_STRIKE_POPULATION_HIT_PCT = 0.50;
    public static readonly THIRD_STRIKE_POPULATION_HIT_PCT = 0.25;

}
