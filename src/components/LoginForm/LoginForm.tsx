import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string>();

  const setValueAndClearError = (value: string, setter: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    setter(value);
    setError("");
  }

  const isLoginButtonDisabled = (): boolean => {
    return loggingIn || !(!!username && !!password);
  }

  const loginButtonClicked = async () => {
    console.debug({ username, password });
    const requestBody = { username, password };
    const request = new Request("https://tictactoe.aboutdream.io/login/",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type":"application/json"
        }
      }
    );

    setLoggingIn(true);
    const response = await fetch(request);
    const responseBody = await response.json()
    console.debug({response, responseBody});
    if (response.status === 200) {
      const { id, token } = responseBody;
      console.debug({ id, token });
      setLoggedIn(true);
    } else {
      console.error("Error while logging in", {status: response.status, username, password});
      console.log({responseBody});
      if (responseBody.errors) {
        // non 200 codes are not documented in the Swagger
        const errors = responseBody.errors as Array<{code: string, message: string, path: string}>;
        // just take the first error for now
        setError(`Error: ${errors[0].message}`);
      } else {
        setError(`An unknown error occurred (status ${response.status})`);
      }
    }
    setLoggingIn(false);
  }

  return (
    <>
      { loggedIn && <Navigate to="/"/> }
      <div>
        <h1>Log in to Tic Tac Toe</h1>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          onChange={(e) => setValueAndClearError(e.target.value, setUsername)}>
        </input><br/>
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          onChange={(e) => setValueAndClearError(e.target.value, setPassword)}>
        </input><br/>
        { !!error &&
          <div style={{color: "red"}}>
            {error}
          </div>
        }
        <button
          disabled={isLoginButtonDisabled()}
          onClick={loginButtonClicked}>
            Login
        </button>
      </div>
    </>
  )
}
