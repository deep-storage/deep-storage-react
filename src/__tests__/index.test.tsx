import * as React from "react";
import { connect } from "../connect";
import { deepStorage } from "deep-storage";
import renderer from "react-test-renderer";

test("connect", async () => {
  interface IProps {
    message1: string;
    message2: string;
    className: string;
  }
  const Component: React.SFC<IProps> = props => (
    <div>
      <div className={props.className}>{props.message1}</div>
      <div className={props.className}>{props.message2}</div>
    </div>
  );
  const storage1 = deepStorage({
    message1: "message 1"
  });
  const storage2 = deepStorage({
    message2: "message 2"
  });
  const Connected = connect<{}, IProps>(
    {
      message1: storage1.deep("message1"),
      message2: storage2.deep("message2"),
    },
    {
      className: "test"
    }
  )(Component);
  const component = <Connected />;
  await storage2.deep("message2").set("updated message 2");
  const rendered1 = renderer.create(component).toJSON();
  expect(rendered1).toMatchSnapshot("start");
  await storage2.deep("message2").set("updated message 3");
  const rendered2 = renderer.create(component).toJSON();
  expect(rendered2).toMatchSnapshot("update");
});
