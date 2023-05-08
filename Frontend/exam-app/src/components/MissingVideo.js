import { Link } from "react-router-dom";
import classes from "./MissingVideo.module.css";

function MissingPhoto() {
  return (
    <div>
      <p>
        Warning! You have to record a video of yourself to be able to join exams.
      </p>
      <Link to="/stream">Record Video</Link>
    </div>
  );
}

export default MissingPhoto;
