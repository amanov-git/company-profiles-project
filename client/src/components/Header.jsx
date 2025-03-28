import React from 'react';
import { useState, useEffect } from 'react';
import companyLogo from '../assets/images/company-logo.png';
import { axiosInstance } from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '../shared/Button';

const Header = () => {
  const [allCategories, setAllCategories] = useState([]);

  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories/get-all-categories');
      // console.log('response: ', response);
      if (response) {
        setAllCategories(response?.data);
      };
    } catch (error) {
      console.error('Error getting data: ', error);
    };
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const accessToken = localStorage.getItem('accessToken');

  const userID = JSON.parse(localStorage.getItem('user'))?.id || '';

  const Authorization = () => {
    return (
      <div className='flex gap-2'>
        <button className='btn btn-md btn-primary' onClick={() => navigate('/login')}>
          Login
        </button>
        <button
          className='btn btn-md btn-primary'
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    )
  };

  const UserAccount = () => {
    return (
      <div
        className='border p-1 rounded-md cursor-pointer'
        onClick={() => navigate(`/user-account/${userID}`)}
      >
        <h6>
          User account
        </h6>
      </div>
    )
  };

  const handleLogout = () => {
    navigate('/');

    localStorage.removeItem('accessToken');

    localStorage.removeItem('user');

    Cookies.remove('refreshToken');
  };

  return (
    <div className='mb-5 py-2 border-2 flex flex-col gap-8 md:flex-row md:justify-around items-center'>

      {/* <div>
        <details className="dropdown">
          <summary className="btn m-1">
            Categories
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {allCategories?.map((category) => (
              <li key={category.id}><a>{category.category_name}</a></li>
            ))}
          </ul>
        </details>
      </div> */}

      <Link to={'/'} className='size-20 flex justify-center items-center'>
        <img src={companyLogo} alt="Company logo" className='w-full h-full' />
      </Link>

      {accessToken
        ? (
          <div>
            <button
              className='btn btn-md text-slate-100 bg-green-500 hover:bg-green-400 active:bg-green-500'
              onClick={() => navigate('/add-new-company')}
            >
              Create company +
            </button>
          </div>
        ) : null}

      {accessToken ? <UserAccount /> : <Authorization />}

      {/* Admin panel */}
      <div>
        <Button type={'button'} color={'purple'} onClick={() => navigate('/admin-panel')}>
          Admin panel
        </Button>
      </div>

      {/* Search companies */}
      <div>
        <Button type={'button'} color={'blue'} onClick={() => navigate('/search-companies')}>
          Search
        </Button>
      </div>

      {/* Log out */}
      {accessToken
        ? (
          <div>
            <button
              className='btn btn-md text-slate-100 cursor-pointer bg-red-500 hover:bg-red-400 active:bg-red-500'
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : null}

    </div>
  )
};

export default Header;