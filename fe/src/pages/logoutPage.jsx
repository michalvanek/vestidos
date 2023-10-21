import { useContext, useEffect } from "react";
import { LoginContext } from "../context/loginContext";

function LogoutPage() {
  const { logout } = useContext(LoginContext);

  useEffect(() => {
    logout();
    // Add a 2-second delay before calling logout and redirecting
    const delay = 2000; // 2 seconds in milliseconds
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, delay);

    // Cleanup the timer to prevent any unexpected behavior
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h1>Logout...</h1>
    </>
  );
}

export default LogoutPage;
