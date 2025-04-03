import React, { forwardRef } from "react";
const ForwardedRefComponent = forwardRef(
  (
    {
      label,
    }: {
      label: string;
    },
    ref
  ) => {
    return <div ref={ref as any}>{label}</div>;
  }
);
export default ForwardedRefComponent;
