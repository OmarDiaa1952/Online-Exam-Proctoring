import { Link } from "react-router-dom";
import classes from "./MissingVideo.module.css";

function MissingPhoto() {
  return (
    <div className="bg-warning fs-4">
      <p>
        Warning! You have to record a video of yourself to be able to join exams.
      </p>
      <Link to="/stream" className="text-secondary">Record Video</Link>
    </div>
  );
}

export default MissingPhoto;
