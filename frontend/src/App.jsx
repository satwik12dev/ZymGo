import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuditTrail from "./pages/administration/audittrial";
import GymList from "./pages/gym/GymList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard" element= {<Dashboard />} />
        <Route
          path="/administration/audittrail"
          element={ <AuditTrail />
          }
        />
         <Route path="/members/gyms" element={<GymList />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;