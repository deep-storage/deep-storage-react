import * as React from "react";
import { DeepStorage, Path, Subscriber } from "deep-storage";

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
  additionalStorage: DeepStorage<any>[] = []
) => (
  BaseComponent: React.ComponentType<BaseComponentPropsType>
): React.ComponentType<ConnectedComponentPropType> => {
  const deepPropsKeys = Object.keys(
    deepProps
  ) as (keyof BaseComponentPropsType)[];

  // if no deep props specified, just return regular component
  if (deepPropsKeys.length === 0)
    return class extends React.Component<ConnectedComponentPropType, {}> {
      render() {
        return <BaseComponent {...ownProps || {}} {...this.props} />;
      }
    };

  return class extends React.Component<ConnectedComponentPropType, {}> {
    subscriber: Subscriber = new Subscriber();

    componentDidMount() {
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
    componentWillUnmount() {
      this.subscriber.onChange(() => {});
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
    shouldComponentUpdate(
      nextProps: ConnectedComponentPropType,
      nextState: {}
    ) {
      const nextPropsAny: any = nextProps;
      for (let key in nextPropsAny) {
        const deepPropsValue = deepProps[key as keyof BaseComponentPropsType];
        if (deepPropsValue) {
          if (deepPropsValue.state !== nextPropsAny[key]) {
            return true;
          }
        }
      }
      return false;
    }
    render() {
      const anyProps: any = this.props;
      const newProps: any = Object.assign({}, anyProps, ownProps || {});
      for (let deepPropsKey in deepProps) {
        const value = deepProps[deepPropsKey];
        if (value) {
          newProps[deepPropsKey] = value.state;
        }
      }
      return <BaseComponent {...newProps} />;
    }
  };
};
