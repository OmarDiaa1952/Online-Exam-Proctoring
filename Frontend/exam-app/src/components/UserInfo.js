import classes from "./UserInfo.module.css";

function UserInfo(props) {
  return (
    <div>
      {/* <div>
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
      </div> */}

      {/* refactoring the above as a table */}
      <div className="card bg-light mb-5 border border-success m-3">
        <div className="card-body">
          <section>
            <h2 className="card-title">Profile Info</h2>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td>Username:</td>
                  <td>{props.userData.username}</td>
                </tr>
                <tr>
                  <td>First name:</td>
                  <td>{props.userData.first_name}</td>
                </tr>
                <tr>
                  <td>Last name:</td>
                  <td>{props.userData.last_name}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{props.userData.email}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>


            );
}

            export default UserInfo;
