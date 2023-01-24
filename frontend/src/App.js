import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";
import Register from "./pages/register/Register.jsx";
import Job from "./pages/job/Job.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import EditPage from "./pages/EditPage/EditPage.jsx";
import AddJob from "./pages/AddJob/AddJob.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/authContext.jsx";
import { QueryClient, QueryClientProvider } from "react-query"

function App() {

  const { currentUser } = useContext(AuthContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="layout">
        {/* <Navbar /> */}
        <Outlet />
      </div>
    )
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace={true} />
    }
    else {
      return children;
    }
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/job/:jobid",
          element: <Job />
        },
        {
          path: "/edit/:jobid",
          element: <EditPage />
        },
        {
          path: "/add",
          element: <AddJob />
        }
      ],
      errorElement: <ErrorPage />
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <ErrorPage />
    }
  ]);
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
