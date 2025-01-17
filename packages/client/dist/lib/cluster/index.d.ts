/// <reference types="node" />
import COMMANDS from './commands';
import { RedisCommand, RedisCommandArgument, RedisCommandArguments, RedisCommandRawReply, RedisCommandReply, RedisFunctions, RedisModules, RedisExtensions, RedisScript, RedisScripts, RedisCommandSignature, RedisFunction } from '../commands';
import { ClientCommandOptions, RedisClientOptions, WithFunctions, WithModules, WithScripts } from '../client';
import { ClusterNode, NodeAddressMap } from './cluster-slots';
import { EventEmitter } from 'events';
import { RedisClusterMultiCommandType } from './multi-command';
export declare type RedisClusterClientOptions = Omit<RedisClientOptions, 'modules' | 'functions' | 'scripts' | 'database'>;
export interface RedisClusterOptions<M extends RedisModules = Record<string, never>, F extends RedisFunctions = Record<string, never>, S extends RedisScripts = Record<string, never>> extends RedisExtensions<M, F, S> {
    rootNodes: Array<RedisClusterClientOptions>;
    defaults?: Partial<RedisClusterClientOptions>;
    useReplicas?: boolean;
    maxCommandRedirections?: number;
    nodeAddressMap?: NodeAddressMap;
}
declare type WithCommands = {
    [P in keyof typeof COMMANDS]: RedisCommandSignature<(typeof COMMANDS)[P]>;
};
export declare type RedisClusterType<M extends RedisModules = Record<string, never>, F extends RedisFunctions = Record<string, never>, S extends RedisScripts = Record<string, never>> = RedisCluster<M, F, S> & WithCommands & WithModules<M> & WithFunctions<F> & WithScripts<S>;
export default class RedisCluster<M extends RedisModules, F extends RedisFunctions, S extends RedisScripts> extends EventEmitter {
    #private;
    static extractFirstKey(command: RedisCommand, originalArgs: Array<unknown>, redisArgs: RedisCommandArguments): RedisCommandArgument | undefined;
    static create<M extends RedisModules, F extends RedisFunctions, S extends RedisScripts>(options?: RedisClusterOptions<M, F, S>): RedisClusterType<M, F, S>;
    constructor(options: RedisClusterOptions<M, F, S>);
    duplicate(overrides?: Partial<RedisClusterOptions<M, F, S>>): RedisClusterType<M, F, S>;
    connect(): Promise<void>;
    commandsExecutor<C extends RedisCommand>(command: C, args: Array<unknown>): Promise<RedisCommandReply<C>>;
    sendCommand<T = RedisCommandRawReply>(firstKey: RedisCommandArgument | undefined, isReadonly: boolean | undefined, args: RedisCommandArguments, options?: ClientCommandOptions): Promise<T>;
    functionsExecutor<F extends RedisFunction>(fn: F, args: Array<unknown>, name: string): Promise<RedisCommandReply<F>>;
    executeFunction(name: string, fn: RedisFunction, originalArgs: Array<unknown>, redisArgs: RedisCommandArguments, options?: ClientCommandOptions): Promise<RedisCommandRawReply>;
    scriptsExecutor<S extends RedisScript>(script: S, args: Array<unknown>): Promise<RedisCommandReply<S>>;
    executeScript(script: RedisScript, originalArgs: Array<unknown>, redisArgs: RedisCommandArguments, options?: ClientCommandOptions): Promise<RedisCommandRawReply>;
    multi(routing?: RedisCommandArgument): RedisClusterMultiCommandType<M, F, S>;
    getMasters(): Array<ClusterNode<M, F, S>>;
    getSlotMaster(slot: number): ClusterNode<M, F, S>;
    quit(): Promise<void>;
    disconnect(): Promise<void>;
}
export {};
