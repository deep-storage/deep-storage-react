/// <reference types="react" />
import * as React from 'react';
import { DeepStorage, DeepSubscription, UsesDeepStorage } from "deep-storage";
export declare const connect: <State extends {}, P, K extends keyof P>(deepProps: {
    [key: string]: DeepStorage<State, {}> | UsesDeepStorage<State>;
}, ownProps?: {
    [key in K]: P[K];
}) => (BaseComponent: React.ComponentType<P>) => {
    new (props?: P, context?: any): {
        subscription: DeepSubscription;
        componentDidMount(): void;
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: P, nextState: {}): boolean;
        render(): JSX.Element;
        setState<K extends never>(f: (prevState: {}, props: P) => Pick<{}, K>, callback?: () => any): void;
        setState<K extends never>(state: Pick<{}, K>, callback?: () => any): void;
        forceUpdate(callBack?: () => any): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<P>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>, prevContext: any): void;
    };
};
export default connect;
