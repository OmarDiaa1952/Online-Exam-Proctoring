import classes from "./EditExamInfo.module.css";

function EditExamInfo(props) {
    return (
        <form onSubmit={props.onSave}>
            <div>
                <label htmlFor="name">Exam Name</label>
                <input type="text" id="name" defaultValue={props.examData.name} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="5" defaultValue={props.examData.description} />
            </div>
            <div>
                <label htmlFor="exam_start_date">Start Date</label>
                <input type="date" id="exam_start_date" />
            </div>
            <div>
                <label htmlFor="exam_end_date">End Date</label>
                <input type="date" id="exam_end_date" />
            </div>
            <div>
                <label htmlFor="duration">Duration</label>
                <input type="time" step="2" id="duration" />
            </div>
            <div>
                <label htmlFor="max_grade">Max Grade</label>
                <input type="number" id="max_grade" defaultValue={props.examData.max_grade} />
            </div>
            <div>
                <button>Save</button>
            </div>
        </form>
    );
}

export default EditExamInfo;