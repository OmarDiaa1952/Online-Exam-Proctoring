import { Link } from "react-router-dom";
import classes from "./MissingVideo.module.css";

function MissingPhoto() {
  return (
    <div className="bg-warning fs-4">
      <p className="text-center">
        Warning! You have to record a video of yourself to be able to join exams.
      </p>
      <Link to="/stream" className="text-secondary">
        <p  className="text-center">
          Record Video
        </p>
        
      </Link>
    </div>
  );
}

export default MissingPhoto;
