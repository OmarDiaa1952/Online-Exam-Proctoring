import React, { useEffect } from "react";
import useWindowFocus from "./useWindowFocus";

const FocusWindow = (props) => {
  const windowFocused = useWindowFocus();

  useEffect(() => {
    props.onChangeFocus(windowFocused);
  }, [windowFocused]);

  return (
    <div>
    </div>
  );
};

export default FocusWindow;
