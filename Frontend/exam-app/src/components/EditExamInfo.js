import classes from "./EditExamInfo.module.css";

function EditExamInfo() {
    return (
        <div>
            <div>
                <label htmlFor="startDate">Start Date</label>
                <input type="date" id="startDate" />
            </div>
            <div>
                <label htmlFor="endDate">End Date</label>
                <input type="date" id="endDate" />
            </div>
            <div>
                <label htmlFor="duration">Duration</label>
                <input type="number" id="duration" />
            </div>
            <div>
                <label htmlFor="maxGrade">Max Grade</label>
                <input type="number" id="maxGrade" />
            </div>
            <div>
                <button type="button">Save</button>
            </div>
        </div>
    );
}

export default EditExamInfo;