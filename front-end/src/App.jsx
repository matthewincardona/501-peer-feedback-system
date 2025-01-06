import React from "react";
// import authStatus from "./utils/authStatus";
import "./App.css";

import Router from "./Router";
import RITBanner from "./components/ui/RITBanner";
import Layout from "./pages/Layout";

function App() {
  // const isLoggedIn = authStatus();
  // // console.log("Auth status", isLoggedIn);

  return (
    <>
      <RITBanner />
      <Router>
        <Layout />
      </Router>
    </>
  );

  // User auth check
  // return (
  //   <>
  //     <RITBanner />
  //     <Router>
  //       if (!isLoggedIn) { // Check if user is logged in
  //         <Navigate to="/login" replace />
  //       }
  //       <Layout />
  //     </Router>
  //   </>
  // );
}

export default App;
