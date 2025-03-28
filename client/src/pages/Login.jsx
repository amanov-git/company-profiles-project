import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/login', loginFormData);

      // console.log('response: ', response);

      if (response) {
        localStorage.setItem('accessToken', response?.data?.accessToken);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));

        Cookies.set('refreshToken', response?.data?.refreshToken, { expires: 30 });

        toast.success(response?.status);
      };

      if (response.status === 200) {
        navigate(`/`);
      };
    } catch (error) {
      console.error('Error: ', error);
      toast.error(error?.message);
    };
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>

      <form onSubmit={handleSubmit} className='w-96 max-w-96 border-4 rounded-lg flex flex-col gap-4 py-3 px-6'>

        <h3 className='text-center'>
          Login form
        </h3>

        <div className='w-full flex flex-col'>
          <label htmlFor="username">
            Username
          </label>
          <input
            id='username'
            type="text"
            name='username'
            className='input input-bordered input-md w-full'
            onChange={handleChange}
            value={loginFormData.username}
          />
        </div>

        <div className='w-full flex flex-col'>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="text"
            id='password'
            name='password'
            className='input input-bordered input-md w-full'
            onChange={handleChange}
            value={loginFormData.password}
          />
        </div>

        <div>
          <button
            className='btn btn-md w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-600 text-slate-100'
            type='submit'
          >
            Login
          </button>
        </div>

      </form>

    </div>
  )
};

export default Login;