import React from 'react';
import Header from '../components/Header';

const PrivateLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container">
        {children}
      </main>
    </>
  );
};

export default PrivateLayout;
