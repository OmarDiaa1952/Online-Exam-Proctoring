import classes from "./UserInfo.module.css";

function UserInfo(props) {
  return (
    <div>
      <div>
        <span>Username: </span>
        <span>{props.userData.username}</span>
      </div>
      <div>
        <span>First name: </span>
        <span>{props.userData.first_name}</span>
      </div>
      <div>
        <span>Last name: </span>
        <span>{props.userData.last_name}</span>
      </div>
      <div>
        <span>Email: </span>
        <span>{props.userData.email}</span>
      </div>
    </div>
  );
}

export default UserInfo;
