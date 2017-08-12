/// <reference types="react" />
import * as React from 'react';
import { DeepStorage, UsesDeepStorage } from "deep-storage";
export interface ComponentCreator<P = {}> {
    component: React.ComponentType<P>;
}
export declare const connect: <PropsType extends {}, Key extends keyof PropsType>(deepProps: {
    [key in Key]: DeepStorage<PropsType[Key], {}> | UsesDeepStorage<PropsType[Key]>;
}, ownProps?: {
    [key in Key]: PropsType[Key];
}) => (BaseComponent: React.ComponentType<PropsType>) => {
    new (props?: PropsType, context?: any): {
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
        componentDidMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<PropsType>, nextContext: any): void;
        shouldComponentUpdate?(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): void;
        componentDidUpdate?(prevProps: Readonly<PropsType>, prevState: Readonly<{}>, prevContext: any): void;
        componentWillUnmount?(): void;
    };
};
export default connect;
