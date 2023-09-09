import React, { useState } from "react";
import Login from "./Component/JSX/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Component/JSX/Dashboard";
import Signup from "./Component/JSX/signUp";
import PaymentLinkGenerator from "./Component/JSX/PaymentLinkGenerator";
import GetApikey from "./Component/JSX/GetApikey";
import Linkshow from "./Component/JSX/Linkshow";
import MerchatDashboard from "./Component/JSX/MerchatDashboard";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup /> }/>
        <Route path="/dashboard" element={<Dashboard />} />        
        <Route path="/PaymentLinkGenerator" element={<PaymentLinkGenerator /> }/>
        <Route path="/GetApikey" element={<GetApikey />} />
        
        <Route path="/MerchatDashboard" element={<MerchatDashboard />} />
        <Route path="/PaymentLinkGenerator/gett/:id/:amd" element={<Linkshow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
