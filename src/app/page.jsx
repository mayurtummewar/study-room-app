import Login from "./login";

export default function Page() {
  // Render the login screen as the app entry. The login UI will navigate
  // to the original home page at `/home` after the user clicks "Login".
  return <Login />;
}