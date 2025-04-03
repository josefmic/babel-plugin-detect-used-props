import React, { useState } from "react";
const HookPropsComponent = ({ test }: { test: any }) => {
  const [message, setMessage] = useState("Initial message");
  const updateMessage = () => {
    setMessage(test);
  };
  return (
    <div>
      <div>{message}</div>
      <button onClick={updateMessage}>Update Message</button>
    </div>
  );
};
export default HookPropsComponent;