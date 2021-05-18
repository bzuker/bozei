import Layout from "../components/layout";
import { useUser } from "../context/Auth";
import { LoginComponent } from "../components/login/LoginComponent";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const { user, loadingUser } = useUser({
    redirectTo: "/explore",
    redirectIfFound: true,
  });

  if (loadingUser || user) {
    return null;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center sm:px-6 md:pt-16">
        <div className="w-full max-w-md p-4 bg-white rounded-md shadow-xl border border-gray-300">
          <div className="flex items-center justify-center">
            <span className="text-xl font-medium text-gray-900">Ingresar</span>
          </div>
          <LoginComponent onLoginCompleted={() => router.replace("/explore")} />
        </div>
      </div>
    </Layout>
  );
}

export default Login;
