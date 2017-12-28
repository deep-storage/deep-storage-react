/// <reference types="react" />
import * as React from 'react';
import { DeepStorage, UsesDeepStorage } from "deep-storage";
export * from './forms';
export interface AsyncFactory<T> {
    create: () => Promise<T>;
}
export interface ComponentCreator<P = {}> extends AsyncFactory<React.ComponentType<P>> {
}
export declare const connect: <PropsType extends {}>(deepProps: {
    [key in keyof PropsType]?: DeepStorage<PropsType[key], {}> | UsesDeepStorage<PropsType[key]>;
}, ownProps?: {
    [key in keyof PropsType]?: PropsType[key];
}) => (BaseComponent: React.ComponentType<PropsType>) => {
    new (props: PropsType, context?: any): {
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: PropsType) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => any): void;
        forceUpdate(callBack?: () => any): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<PropsType>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentDidMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<PropsType>, nextContext: any): void;
        shouldComponentUpdate?(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<PropsType>, prevState: Readonly<{}>, prevContext: any): void;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    };
};
export default connect;
