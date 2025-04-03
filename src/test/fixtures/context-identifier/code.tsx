import React, { createContext, useContext } from "react";
const MessageContext = createContext("Default message");
const ContextComponent = () => {
  const message = useContext(MessageContext);
  return <div>{message}</div>;
};
const App = () => {
  return (
    <MessageContext.Provider value="Message from context">
      <ContextComponent />
    </MessageContext.Provider>
  );
};
export default App;
