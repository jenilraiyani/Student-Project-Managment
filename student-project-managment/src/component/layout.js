import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

const Layout = () => {
  return (
    <>
      
      <div className="spms-layout-wrapper">
        
      
        <Sidebar />

     
        <div className="spms-main-content">
          
          
          <Header />

         
          <main className="spms-page-container">
            <Outlet />
          </main>
          
        </div>
      </div>

      
      <style>
        {`
          /* Global resets */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #F1F5F9; /* Main Page Background */
            overflow: hidden; /* Prevents whole-page scrolling */
          }

          /* Force Row Layout (Sidebar Left, Content Right) */
          .spms-layout-wrapper {
            display: flex;
            flex-direction: row;
            height: 100vh;
            width: 100vw;
          }

          /* Force Column Layout for Right Side (Header Top, Content Bottom) */
          .spms-main-content {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            height: 100vh;
            background-color: #F1F5F9;
            overflow: hidden;
          }

          /* Ensure page content takes remaining height and scrolls independently */
          .spms-page-container {
            flex-grow: 1;
            padding: 25px;
            overflow-y: auto;
            background-color: #F1F5F9;
          }
        `}
      </style>
    </>
  );
};

export default Layout;