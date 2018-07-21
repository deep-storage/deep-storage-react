import * as React from "react";

import { DeepStorage, Subscriber } from "deep-storage";

export const wire = <
  ConnectedComponentPropType extends {},
  BaseComponentPropsType extends {}
>(
  component: React.ComponentType<BaseComponentPropsType>,
  deepProps: {
    [key in keyof BaseComponentPropsType]?: DeepStorage<
      BaseComponentPropsType[key]
    >
  },
  ownProps?: {
    [key in keyof BaseComponentPropsType]?: BaseComponentPropsType[key]
  },
  additionalStorage: Array<DeepStorage<any>> = []
) => {
  return connect<ConnectedComponentPropType, BaseComponentPropsType>(
    deepProps,
    ownProps,
    additionalStorage
  )(component);
};

export const connect = <
  ConnectedComponentPropType extends {},
  BaseComponentPropsType extends {}
>(
  deepProps: {
    [key in keyof BaseComponentPropsType]?: DeepStorage<
      BaseComponentPropsType[key]
    >
  },
  ownProps?: {
    [key in keyof BaseComponentPropsType]?: BaseComponentPropsType[key]
  },
  additionalStorage: Array<DeepStorage<any>> = []
) => (
  BaseComponent: React.ComponentType<BaseComponentPropsType>
): React.ComponentType<ConnectedComponentPropType> => {
  const deepPropsKeys = Object.keys(deepProps) as Array<
    keyof BaseComponentPropsType
  >;

  // if no deep props specified, just return regular component
  if (deepPropsKeys.length === 0 && additionalStorage.length === 0) {
    return class extends React.Component<ConnectedComponentPropType, {}> {
      public render() {
        return <BaseComponent {...ownProps || {}} {...this.props} />;
      }
    };
  }

  // tslint:disable-next-line:max-classes-per-file
  return class extends React.Component<ConnectedComponentPropType, {}> {
    public subscriber: Subscriber = new Subscriber();

    public componentDidMount() {
      this.subscriber.onChange(() => {
        this.forceUpdate();
      });
      for (const deepPropsKey of deepPropsKeys) {
        const deepPropsValue = deepProps[deepPropsKey];
        if (deepPropsValue) {
          deepPropsValue.addSubscriber(this.subscriber);
        }
      }
      for (const storage of additionalStorage) {
        storage.addSubscriber(this.subscriber);
      }
    }
    public componentWillUnmount() {
      this.subscriber.onChange(() => {
        // noop
      });
      for (const deepPropsKey of deepPropsKeys) {
        const deepPropsValue = deepProps[deepPropsKey];
        if (deepPropsValue) {
          deepPropsValue.removeSubscriber(this.subscriber);
        }
      }
      for (const storage of additionalStorage) {
        storage.removeSubscriber(this.subscriber);
      }
    }
    public shouldComponentUpdate(
      nextProps: ConnectedComponentPropType,
      nextState: {}
    ) {
      const nextPropsAny: any = nextProps;
      for (const key in nextPropsAny) {
        if (nextPropsAny.hasOwnProperty(key)) {
          const deepPropsValue = deepProps[key as keyof BaseComponentPropsType];
          if (deepPropsValue) {
            if (deepPropsValue.state !== nextPropsAny[key]) {
              return true;
            }
          }
        }
      }
      return false;
    }
    public render() {
      const anyProps: any = this.props;
      const newProps: any = Object.assign({}, anyProps, ownProps || {});
      for (const deepPropsKey in deepProps) {
        if (deepProps.hasOwnProperty(deepPropsKey)) {
          const value = deepProps[deepPropsKey];
          if (value) {
            newProps[deepPropsKey] = value.state;
          }
        }
      }
      return <BaseComponent {...newProps} />;
    }
  };
};
