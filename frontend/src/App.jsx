import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuditTrail from "./pages/administration/audittrial";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard" element= {<Dashboard />} />
        <Route
          path="/administration/audittrail"
          element={ <AuditTrail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;