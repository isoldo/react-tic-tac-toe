import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [repeatedPassword, setRepeatedPassword] = useState<string>();

  const isPasswordMatch = (): boolean => {
    return !!password && (password === repeatedPassword);
  }

  const isRegisterButtonDisabled = (): boolean => {
    return !(!!username && isPasswordMatch());
  }

  const registerButtonClicked = () => {
    console.debug({username, password, repeatedPassword, match: isPasswordMatch()});
  }

  return (
    <div>
      <h1>Register to Tic Tac Toe</h1>
      <label htmlFor="username">Username: </label>
      <input
        id="username"
        onChange={(e) => setUsername(e.target.value)}>
      </input><br/>
      <label htmlFor="password">Password: </label>
      <input
        id="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}>
      </input><br/>
      <label htmlFor="repeatedPassword">Reenter password: </label>
      <input
        id="repeatedPassword"
        type="password"
        onChange={(e) => setRepeatedPassword(e.target.value)}>
      </input><br/>
      <button
        disabled={isRegisterButtonDisabled()}
        onClick={registerButtonClicked}>
          Register
      </button>
    </div>
  )
}
