import React from "react";
const NestedFunctionsComponent = ({ name }: { name: string }) => {
  const deepFunction = (name: string) => {
    const nestedFunction = (name: string) => {
      return `Hello, ${name}`;
    };
    return nestedFunction(name);
  };
  return <div>{deepFunction(name)}</div>;
};
export default NestedFunctionsComponent;
