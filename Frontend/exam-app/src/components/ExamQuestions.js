import classes from "./ExamQuestions.module.css";
import Question from "./Question";

function ExamQuestions(props) {
    return (
        <section>
        <h2>Questions:</h2>
        <div>
            {props.questions.map((question) => (
            <Question
                key={question.questionId}
                questionId={question.questionId}
                questionText={question.questionText}
                questionGrade={question.questionGrade}
                choices={question.choices}
                onChoiceChange={props.onChoiceChange}
            />
            ))}
        </div>
        </section>
    );
    }

export default ExamQuestions;