import React, { useMemo } from "react";
const MemoizedComponent = ({ value }: { value: number }) => {
  const computedValue = useMemo(() => {
    return value * 2;
  }, [value]);
  return <div>{computedValue}</div>;
};
export default MemoizedComponent;
