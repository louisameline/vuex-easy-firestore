import { AnyObject } from '../declarations';
export declare type IState = {
    _sync: {
        id: string;
        signedIn: boolean;
        userId: any;
        streaming: AnyObject;
        unsubscribe: AnyObject;
        pathVariables: AnyObject;
        patching: boolean;
        syncStack: {
            inserts: any[];
            updates: AnyObject;
            propDeletions: AnyObject;
            deletions: any[];
            debounceTimer: any;
            resolves: Promise<any>[];
            rejects: Promise<any>[];
        };
        fetched: AnyObject;
        stopPatchingTimeout: any;
        syncDownEnabled: boolean;
        syncUpEnabled: boolean;
    };
    [key: string]: any;
};
/**
 * a function returning the state object with ONLY the ._sync prop
 *
 * @export
 * @returns {IState} the state object
 */
export default function (): IState;
