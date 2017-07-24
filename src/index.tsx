import * as React from 'react';
import { DeepStorage, Path, DeepSubscription, parsePaths, stringOrNumber } from "deep-storage";

export const deep = <State extends {}, P, K extends keyof P>(
    storage: DeepStorage<State>,
    paths: { [key: string]: Path | stringOrNumber },
    ownProps?: { [key in K]: P[K] }) => (BaseComponent: React.ComponentType<P>) => {
        const parsedPaths = parsePaths(paths);
        return class extends React.Component<P, {}> {
            subscription: DeepSubscription;
            componentDidMount() {
                this.subscription = storage.subscription((...args: any[]) => {
                    this.forceUpdate();
                });
                for (let key in paths) {
                    this.subscription.subscribeTo(...parsedPaths[key]);
                }
            }
            componentWillUnmount() {
                this.subscription && this.subscription.cancel();
            }
            shouldComponentUpdate(nextProps: P, nextState: {}) {
                const nextPropsAny: any = nextProps;
                for (let key in parsedPaths) {
                    if (nextPropsAny[key] !== storage.stateIn(...parsedPaths[key])) {
                        return true;
                    }
                }
                return false;
            }
            render() {
                const anyProps: any = this.props;
                const newProps: any = { ...anyProps, ...(ownProps || {}) };
                for (let key in parsedPaths) {
                    newProps[key] = storage.stateIn(...parsedPaths[key])
                }
                return <BaseComponent {...newProps} />;
            }
        };
    }