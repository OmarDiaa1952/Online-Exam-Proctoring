import classes from "./UserInfo.module.css";

function UserInfo(props) {
  return (
    <div>
      <div>{props.userData.username}</div>
      <div>{props.userData.first_name}</div>
      <div>{props.userData.last_name}</div>
      <div>{props.userData.email}</div>
    </div>
  );
}

export default UserInfo;
