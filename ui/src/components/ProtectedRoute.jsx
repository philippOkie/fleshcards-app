import LoginPage from "./LoginPage";

function ProtectedRoute() {
  return (
    <div className="flex justify-center align-center h-screen pt-32 pb-32 pl-150 pr-150">
      <LoginPage />
    </div>
  );
}

export default ProtectedRoute;
