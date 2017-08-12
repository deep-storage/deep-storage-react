/// <reference types="react" />
import * as React from 'react';
import { DeepStorage, DeepSubscription, UsesDeepStorage } from "deep-storage";
export declare const connect: <PropsType extends {}, Key extends keyof PropsType>(deepProps: {
    [key in Key]: DeepStorage<PropsType[Key], {}> | UsesDeepStorage<PropsType[Key]>;
}, ownProps?: {
    [key in Key]: PropsType[Key];
}) => (BaseComponent: React.ComponentType<PropsType>) => {
    new (props?: PropsType, context?: any): {
        subscription: DeepSubscription;
        componentDidMount(): void;
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: PropsType, nextState: {}): boolean;
        render(): JSX.Element;
        setState<K extends never>(f: (prevState: {}, props: PropsType) => Pick<{}, K>, callback?: () => any): void;
        setState<K extends never>(state: Pick<{}, K>, callback?: () => any): void;
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
        componentWillReceiveProps?(nextProps: Readonly<PropsType>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<PropsType>, prevState: Readonly<{}>, prevContext: any): void;
    };
};
export default connect;
