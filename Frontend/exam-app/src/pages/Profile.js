import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import UserInfo from "../components/UserInfo";
import UserContext from "../store/user-context";
import { get, put } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

const svgImg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="150px"
    height="150px"
    viewBox="0 0 20 20"
    version="1.1"
  >
    <title>profile_round [#1342]</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g
        id="Dribbble-Light-Preview"
        transform="translate(-140.000000, -2159.000000)"
        fill="#6c757d"
      >
        <g id="icons" transform="translate(56.000000, 160.000000)">
          <path
            d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"
            id="profile_round-[#1342]"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

function ProfilePage() {
  const userCtx = useContext(UserContext);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    photo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userCtx.type === "student") checkPhoto();
    getUserData();
  }, [hasPhoto]);

  let checkPhoto = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/photoexists",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.photo_exists) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
    setIsLoading(false);
  };

  let getUserData = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/userdata",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setUserData(data);
      if (hasPhoto) {
        let response = await get(
          BASEURL + "/users/photoretrieve",
          userCtx.authTokens.access
        );
        let data = await response.json();
        if (response.status === 200) {
          setUserData((prev) => ({
            ...prev,
            photo: data.photo,
          }));
        } else {
          swal({
            title: "Error",
            text: "Couldn't retrieve your photo.",
            icon: "error",
            button: "OK",
          });
        }
      }
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
    setIsLoading(false);
  };

  const history = useNavigate();
  const useCamera = () => {
    navigator.getUserMedia(
      { audio: true, video: true },
      function (stream) {
        stream.getTracks().forEach((x) => x.stop());
        history("/profile-pic");
      },
      (err) => console.log(err)
    );
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="container-fluid flex-row general">
            <div className="container-fluid row">
              <div className="col-2 row d-flex flex-column justify-content-center align-items-center">
                <div className="p-2 align-self-center">
                  {hasPhoto ? (
                    <img
                      src={userData.photo}
                      alt="Couldn't load photo"
                      width="180px"
                      height="180px"
                      className="border border-success rounded-circle"
                    />
                  ) : (
                    svgImg
                  )}
                </div>
                <div className="p-2 align-self-center">
                  <button
                    type="button"
                    onClick={useCamera}
                    className="btn btn-success btn-lg"
                  >
                    {hasPhoto ? "Update Photo" : "Take Photo"}
                  </button>
                </div>
              </div>
              <div className="col-1"></div>
              <div className="col-8">
                <UserInfo userData={userData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
