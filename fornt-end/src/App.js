import React, { useState } from "react";
import Login from "./Component/JSX/Login";
import Shop from "./Component/JSX/Shop";
import Sales from "./Component/JSX/Sales";
import Customer from "./Component/JSX/customer";
import History from "./Component/JSX/History";
import Performance from "./Component/JSX/Performance";
import { BrowserRouter, Route, Routes , useParams  } from "react-router-dom";
import Stocks from "./Component/JSX/Stocks";
import Inventory from "./Component/JSX/Inventory";
import Dashboard from "./Component/JSX/Dashboard";
import Signup from "./Component/JSX/signUp";
import PaymentLinkGenerator from "./Component/JSX/PaymentLinkGenerator";
import GetApikey from "./Component/JSX/GetApikey";
import Linkshow from "./Component/JSX/Linkshow";

const App = () => {

  let { id } = useParams();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route
          path="/Signup"
          element={
            <>
              {" "}
              <Signup />{" "}
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/shop"
          element={
            <>
              {" "}
              <Shop />{" "}
            </>
          }
        />
        <Route
          path="/customer"
          element={
            <>
              {" "}
              <Customer />{" "}
            </>
          }
        />
        <Route
          path="/sales"
          element={
            <>
              {" "}
              <Sales />
            </>
          }
        />
        <Route
          path="/stock"
          element={
            <>
              {" "}
              <Stocks />
            </>
          }
        />
        <Route
          path="/inventory"
          element={
            <>
              {" "}
              <Inventory />
            </>
          }
        />
        <Route
          path="/detailed-history"
          element={
            <>
              {" "}
              <History />
            </>
          }
        />
        <Route
          path="/performance"
          element={
            <>
              {" "}
              <Performance />
            </>
          }
        />
        <Route
          path="/PaymentLinkGenerator"
          element={
            <>
              {" "}
              <PaymentLinkGenerator />
            </>
          }
        />
        <Route path="/GetApikey" element={<GetApikey />} />
        <Route path="/PaymentLinkGenerator/gett/:id" element={<Linkshow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
