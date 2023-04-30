import React, { useEffect } from "react";
import useWindowFocus from "./useWindowFocus";

const FocusWindow = (props) => {
  const windowFocused = useWindowFocus();
  useEffect(() => {
    props.onChangeFocus(windowFocused);
  }, [windowFocused]);
  return <div>
    {!windowFocused && <p>Warning, Please return instantly to the exam otherwise the exam will be ended!</p>}
  </div>;
};

export default FocusWindow;
