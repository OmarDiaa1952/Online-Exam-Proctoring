import React from "react";
import useWindowFocus from "./useWindowFocus";

const FocusWindow = () => {
  const windowFocused = useWindowFocus();
  console.log(windowFocused);
  return (
    <div>
      <span>{windowFocused ? 'Focused' : 'Not focused'}</span>
    </div>
  );
};

export default FocusWindow;
