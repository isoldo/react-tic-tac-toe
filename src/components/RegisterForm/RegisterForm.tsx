import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [repeatedPassword, setRepeatedPassword] = useState<string>();
  const [error, setError] = useState<string>();

  const isPasswordMatch = (): boolean => {
    return !!password && (password === repeatedPassword);
  }

  const isRegisterButtonDisabled = (): boolean => {
    return !(!!username && isPasswordMatch());
  }

  const registerButtonClicked = async () => {
    console.debug({username, password, repeatedPassword, match: isPasswordMatch()});
    const body = { username, password };
    const request = new Request("https://tictactoe.aboutdream.io/register/",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type":"application/json"
        }
      }
    );

    const response = await fetch(request);
    console.debug({response});
    if (response.status !== 200) {
      console.error("Error while registering user", {status: response.status, username, password});
      const responseBody = await response.json();
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
  }

  const setValueAndClearError = (value: string, setter: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    setter(value);
    setError("");
  }

  return (
    <div>
      <h1>Register to Tic Tac Toe</h1>
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
      <label htmlFor="repeatedPassword">Reenter password: </label>
      <input
        id="repeatedPassword"
        type="password"
        onChange={(e) => setValueAndClearError(e.target.value, setRepeatedPassword)}>
      </input><br/>
      { !!error &&
        <div style={{color: "red"}}>
          {error}
        </div>
      }
      <button
        disabled={isRegisterButtonDisabled()}
        onClick={registerButtonClicked}>
          Register
      </button>
    </div>
  )
}
