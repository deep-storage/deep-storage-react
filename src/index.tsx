import * as React from 'react';
import { DeepStorage, Path, DeepSubscription, parsePaths, stringOrNumber } from "deep-storage";

export * from './forms';

export interface AsyncFactory<T> {
    create: () => Promise<T>;
}

export interface ComponentCreator<P = {}> extends AsyncFactory<React.ComponentType<P>> {
}

export const connect = <PropsType extends {}>(
    deepProps: {[key in keyof PropsType]?: DeepStorage<PropsType[key]> },
    ownProps?: {[key in keyof PropsType]?: PropsType[key]}) => (BaseComponent: React.ComponentType<PropsType>) => {

        const keys = Object.keys(deepProps) as (keyof PropsType)[];

        // if no deep props specified, just return regular component
        if (keys.length === 0) return class extends React.Component<PropsType, {}> {
            render() {
                return <BaseComponent {...(ownProps || {}) } {...this.props} />;
            }
        };

        const rootStorage = deepProps[keys[0]].root();
        const parsedPaths = {} as { [key: string]: Path };

        // go through each of the storages... we're going to assume for now that
        // they all have the same root
        for (let key of keys) {
            parsedPaths[key] = deepProps[key].path;
        }

        return class extends React.Component<PropsType, {}> {
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
            shouldComponentUpdate(nextProps: PropsType, nextState: {}) {
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
                const newProps: any = Object.assign({}, anyProps, ownProps || {});
                for (let key in parsedPaths) {
                    const value = deepProps[key as keyof PropsType];
                    newProps[key] = (value as DeepStorage<PropsType[keyof PropsType]>).state;
                }
                return <BaseComponent {...newProps} />;
            }
        };
    }

export default connect;