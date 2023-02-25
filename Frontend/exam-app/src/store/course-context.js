import { createContext, useState } from "react";

const CourseContext = createContext({
  newCourseFlag: false,
  newExamFlag: false,
  setNewCourseFlag: (flag) => {},
  setNewExamFlag: (flag) => {},
});

export function CourseContextProvider(props) {
  const [newCourseFlag, setNewCourseFlag] = useState(false);
  const [newExamFlag, setNewExamFlag] = useState(false);

  function setNewCourseFlagHandler(type) {
    setNewCourseFlag(type);
  }
  function setNewExamFlagHandler(type) {
    setNewExamFlag(type);
  }

  const context = {
    newCourseFlag: newCourseFlag,
    newExamFlag: newExamFlag,
    setNewCourseFlag: setNewCourseFlagHandler,
    setNewExamFlag: setNewExamFlagHandler,
  };

  return (
    <CourseContext.Provider value={context}>
      {props.children}
    </CourseContext.Provider>
  );
}

export default CourseContext;
