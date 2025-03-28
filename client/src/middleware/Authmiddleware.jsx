import React from 'react';
import Layout from '../components/Layout';

const Authmiddleware = ({ children }) => {
  return (
    <div>
      <Layout>
        {children}
      </Layout>
    </div>
  )
}

export default Authmiddleware