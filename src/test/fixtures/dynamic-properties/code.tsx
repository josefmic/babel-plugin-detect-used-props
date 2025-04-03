import React from "react";
const DynamicPropsComponent = ({ test }: { test: any }) => {
  return <div>{test["property1"]}</div>;
};
export default DynamicPropsComponent;
