import { RedisCommandArgument, RedisCommandArguments } from '.';
export declare const FIRST_KEY_INDEX = 1;
declare type MaximumOneOf<T, K extends keyof T = keyof T> = K extends keyof T ? {
    [P in K]?: T[K];
} & Partial<Record<Exclude<keyof T, K>, never>> : never;
declare type SetTTL = MaximumOneOf<{
    EX: number;
    PX: number;
    EXAT: number;
    PXAT: number;
    KEEPTTL: true;
}>;
declare type SetGuards = MaximumOneOf<{
    NX: true;
    XX: true;
}>;
interface SetCommonOptions {
    GET?: true;
}
declare type SetOptions = SetTTL & SetGuards & SetCommonOptions;
export declare function transformArguments(key: RedisCommandArgument, value: RedisCommandArgument | number, options?: SetOptions): RedisCommandArguments;
export declare function transformReply(): RedisCommandArgument | null;
export {};
