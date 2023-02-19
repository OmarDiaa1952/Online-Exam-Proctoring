import classes from "./Login.module.css";

function Login() {
  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" required id="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" required id="password" />
      </div>
      <div>
        <button>Login</button>
      </div>
    </form>
  );
}

export default Login;
