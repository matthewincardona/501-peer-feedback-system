import { BrowserRouter, Route, Routes } from "react-router-dom";
import Groups from "./pages/Groups/index.jsx";
import Teams from "./pages/Teams/index.jsx";
import Responses from "./pages/Responses/index.jsx";
import Dashboard from "./pages/Dashboard/index.jsx";
import Login from "./pages/Login/index.jsx";
import AddForm from "./pages/Forms/index.jsx";
import NewForm from "./pages/NewForm/index.jsx";
import CreateGroup from "./pages/CreateGroup/index.jsx";
import CreateUsers from "./pages/CreateUsers/index.jsx";
import Result from "./pages/Results/Result.jsx"
import ReForm from "./pages/NewForm/rebuildform.jsx"
import FormDatePicker from "./pages/FormDatePicker/index.jsx";
import Creator from "./pages/CreatorPermission/index.jsx";
import AdminView from "./pages/AdminView/index.jsx"
import EditGroup from "./pages/EditGroup/index.jsx";
import EditUsers from "./pages/EditUsers/index.jsx";
import EditForm from "./pages/NewForm/EditForm.jsx"
import Documentation from "./pages/Documentation/index.jsx";
import EditCreator from "./pages/EditCreatorPermission/index.jsx";
import EditFormDatePicker from "./pages/EditFormDatePicker/index.jsx";
import EditNewForm from "./pages/Forms/editformspage.jsx";


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define your routes */}
        <Route path="documentation/*" element={<Documentation />} />
        <Route path="editgroup/*" element={<EditGroup />} />
        <Route path="editgroup/editusers/*" element={<EditUsers />} />
        <Route path="editgroup/editusers/editcreator/*" element={<EditCreator />} />
        <Route path="/editgroup/editusers/editcreator/editdatepicker/*" element={<EditFormDatePicker />} />
        <Route path="/editgroup/editusers/editcreator/editdatepicker/editnewform/*" element={<EditNewForm />} />
        <Route path="/editgroup/editusers/editcreator/editdatepicker/editform/*" element={<EditForm />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/adminview/*" element={<AdminView />} />
        <Route path="/groups/*" element={<Groups />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="groups/teams/*" element={<Teams />} />
        <Route path="groups/teams/results/*" element={<Responses />} />
        <Route path="/results/*" element={<Result />} />
        <Route path="/reform/*" element={<ReForm />} /> 
        <Route path="/AdminView/*" element={<AdminView />} />
        <Route path="/creategroup/*" element={<CreateGroup />} />
        <Route path="/creategroup/addusers/*" element={<CreateUsers />} />
        <Route path="/creategroup/addusers/creator/*" element={<Creator />} />
        <Route path="/creategroup/addusers/creator/datepicker/*" element={<FormDatePicker />} />
        <Route path="/creategroup/addusers/creator/datepicker/form/*" element={<AddForm />} />
        <Route path="/creategroup/addusers/creator/datepicker/newform/*" element={<NewForm />} />
        {/* TODO: Add 404 page */}
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
