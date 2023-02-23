import { createContext, useState } from "react";

const CourseContext = createContext({
  newCourseFlag: false,
  setNewCourseFlag: (flag) => {},
});

export function CourseContextProvider(props) {
  const [newCourseFlag, setNewCourseFlag] = useState(false);

  function setNewCourseFlagHandler(type) {
    setNewCourseFlag(type);
  }

  const context = {
    newCourseFlag: newCourseFlag,
    setNewCourseFlag: setNewCourseFlagHandler,
  };

  return (
    <CourseContext.Provider value={context}>
      {props.children}
    </CourseContext.Provider>
  );
}

export default CourseContext;
