function LoginPage() {
  return (
    <div className="card bg-neutral text-neutral-content w-250 p-8 pl-12 pr-12 gap-6">
      <div className="space-y-2">
        <div className="text-3xl font-bold">Login</div>
        <div>Enter your email and password to log in!</div>
      </div>
      <div className="space-y-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Email / Login</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </label>

        <button className="btn btn-block btn-accent !mt-6">LOGIN</button>
      </div>

      <div className="divider">OR</div>

      <div></div>
    </div>
  );
}

export default LoginPage;
