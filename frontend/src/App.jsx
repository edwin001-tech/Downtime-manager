import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./layouts/Dashboard";
import OngoingIssuesList from "./pages/OngoingIssuesList";
import IssuesCreate from "./pages/IssuesCreate";
import IssuesEdit from "./pages/IssuesEdit";
import ResolvedIssuesList from "./pages/ResolvedIssuesList";
import Home from "./pages/Home";
import NotFound from "./pages/NotFoundPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="ongoing" element={<OngoingIssuesList />} />
          <Route path="ongoing/create" element={<IssuesCreate />} />
          <Route path="ongoing/:id/edit" element={<IssuesEdit />} />
          <Route path="resolved" element={<ResolvedIssuesList />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition="slide"
      />
    </BrowserRouter>
  );
}

export default App;
