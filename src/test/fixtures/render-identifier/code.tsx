import React from "react";
const RenderPropsComponent = ({
  render,
}: {
  render: (message: string) => any;
}) => {
  return <div>{render("Message from render prop")}</div>;
};
const App = () => {
  return <RenderPropsComponent render={(message) => <div>{message}</div>} />;
};
export default App;
