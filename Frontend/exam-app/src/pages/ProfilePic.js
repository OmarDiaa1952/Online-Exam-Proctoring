import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CameraSet from "../components/CameraSet";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import StudentPicture from "../components/StudentPicture";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function ProfilePic() {
  const [cameraSetFlag, setCameraSetFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  let updatePicHandler = () => {
    setCameraSetFlag(true);
  };

  let setPhoto = async (imageDataURL) => {
    setIsLoading(true);
    let response = await post(
      BASEURL + "/users/photoupload",
      { photo: imageDataURL },
      userCtx.authTokens.access
    );
    if (response.status === 201) {
      swal({
        title: "Success!",
        text: "Photo updated successfully!",
        icon: "success",
        button: "Ok!",
      });
      navigate("/profile");
    } else {
      swal({
        title: "Error",
        text: "Couldn't upload your photo.",
        icon: "error",
        button: "OK",
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div>
            {cameraSetFlag ? (
              <StudentPicture updatePhoto={setPhoto} />
            ) : (
              <CameraSet onProceed={updatePicHandler} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePic;
