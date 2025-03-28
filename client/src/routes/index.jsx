import { createBrowserRouter } from 'react-router-dom';
// Components
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import CompanyDetails from '../pages/CompanyDetails';
import Register from '../pages/Register';
import Login from '../pages/Login';
import AddNewCompany from '../pages/AddNewCompany';
import SearchCompanies from '../pages/SearchCompanies';
import UserAccount from '../pages/UserAccount';
import EditCompany from '../pages/EditCompany';
import AdminPanel from '../pages/AdminPanel';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    )
  },
  {
    path: '/company-details/:companyID',
    element: (
      <Layout>
        <CompanyDetails />
      </Layout>
    )
  },
  {
    path: '/register',
    element: (
      <Register />
    )
  },
  {
    path: '/login',
    element: (
      <Login />
    ),
  },
  {
    path: '/add-new-company',
    element: (
      <Layout>
        <AddNewCompany />
      </Layout>
    )
  },
  {
    path: '/search-companies',
    element: (
      <Layout>
        <SearchCompanies />
      </Layout>
    )
  },
  {
    path: '/user-account/:userID',
    element: (
      <Layout>
        <UserAccount />
      </Layout>
    ),
  },
  {
    path: '/edit-company',
    element: (
      <Layout>
        <EditCompany />
      </Layout>
    )
  },
  {
    path: '/admin-panel',
    element: (
      <Layout>
        <AdminPanel />
      </Layout>
    )
  },
]);

export default routes;