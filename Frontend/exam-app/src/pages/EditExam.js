import { Link } from "react-router-dom";
import { useContext } from "react";

import ExamQuestionsEdit from "../components/ExamQuestionsEdit";
import CourseContext from "../store/course-context";
import EditExamInfo from "../components/EditExamInfo";

function EditExamPage() {
  const courseCtx = useContext(CourseContext);
  const DUMMY_DATA1 = {
    startDate: "2021-06-01 20:00:00",
    endDate: "2021-06-01 21:10:00",
    duration: "1:00:00",
    maxGrade: 100,
  };
  const DUMMY_DATA2 = [];
  return (
    <section>
      <h1>Edit Exam</h1>
      <div>
        <EditExamInfo examData={DUMMY_DATA1} />
      </div>
      <div>
        <ExamQuestionsEdit questions={DUMMY_DATA2} editable={true} />
      </div>
      <div>
        <div>
          <Link to="/preview-exam">
            <button type="button">Save</button>
          </Link>
        </div>
        <div>
          <Link to={courseCtx.newExamFlag ? "/course" : "/preview-exam"}>
            <button type="button">Cancel</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditExamPage;