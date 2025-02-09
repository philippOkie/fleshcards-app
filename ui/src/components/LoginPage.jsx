import { useState } from "react";

function LoginPage() {
  const [emailOrLogin, setEmailOrLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailOrLoginChange = (e) => {
    setEmailOrLogin(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginBtnClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginOrEmail: emailOrLogin,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
      } else {
        console.error(`Error: ${response.status} - ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center align-center h-screen pt-32 pb-32 pl-150 pr-150">
      <div className="card bg-neutral text-neutral-content w-250 p-8 pl-12 pr-12 gap-6 ">
        <div className="space-y-2">
          <div className="text-3xl font-bold">Login</div>
          <div>Enter your Email / Login and Password to log in!</div>
        </div>

        <div className="space-y-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email / Login</span>
            </div>

            <input
              type="text"
              onChange={handleEmailOrLoginChange}
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>

            <input
              type="text"
              onChange={handlePasswordChange}
              className="input input-bordered w-full"
            />
          </label>

          <button
            className="btn btn-block btn-accent !mt-6"
            onClick={handleLoginBtnClick}
          >
            LOGIN
          </button>
        </div>

        <div className="divider">OR</div>

        <div></div>
      </div>
    </div>
  );
}

export default LoginPage;
