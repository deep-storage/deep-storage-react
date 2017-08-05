import * as React from 'react';
import { DeepStorage, Path, DeepSubscription, parsePaths, stringOrNumber, UsesDeepStorage } from "deep-storage";

function isUsesDeepStorage<State>(
    value: DeepStorage<State> | UsesDeepStorage<State>
): value is UsesDeepStorage<State> {
    return (value as UsesDeepStorage<State>).storage !== undefined;
}

function getStorage<State>(value: DeepStorage<State> | UsesDeepStorage<State>) {
    if(isUsesDeepStorage(value)) {
        return value.storage;
    } else {
        return value;
    }
}

export const deep = <State extends {}, P, K extends keyof P>(
    deepProps: { [key: string]: DeepStorage<State> | UsesDeepStorage<State> },
    ownProps?: {[key in K]: P[K]}) => (BaseComponent: React.ComponentType<P>) => {

        const keys = Object.keys(deepProps);
        if (keys.length === 0) throw 'No deep properties specified';

        const rootStorage = getStorage(deepProps[keys[0]]).root();
        const parsedPaths = {} as { [key: string]: Path };

        // go through each of the storages... we're going to assume for now that
        // they all have the same root
        for (let key of Object.keys(deepProps)) {
            parsedPaths[key] = getStorage(deepProps[key]).path;
        }

        return class extends React.Component<P, {}> {
            subscription: DeepSubscription;
            componentDidMount() {
                this.subscription = rootStorage.subscription((...args: any[]) => {
                    this.forceUpdate();
                });
                for (let key in deepProps) {
                    this.subscription.subscribeTo(...parsedPaths[key]);
                }
            }
            componentWillUnmount() {
                this.subscription && this.subscription.cancel();
            }
            shouldComponentUpdate(nextProps: P, nextState: {}) {
                const nextPropsAny: any = nextProps;
                for (let key in parsedPaths) {
                    if (nextPropsAny[key] !== rootStorage.stateIn(...parsedPaths[key])) {
                        return true;
                    }
                }
                return false;
            }
            render() {
                const anyProps: any = this.props;
                const newProps: any = { ...anyProps, ...(ownProps || {}) };
                for (let key in parsedPaths) {
                    const value = deepProps[key];
                    if(isUsesDeepStorage(value)) {
                        newProps[key] = value;
                    } else {
                        newProps[key] = value.state;
                    }
                }
                return <BaseComponent {...newProps} />;
            }
        };
    }