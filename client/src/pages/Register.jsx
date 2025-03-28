import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Register = () => {
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    titleID: '1',
  });

  const [titles, setTitles] = useState([]);

  const navigate = useNavigate();

  const getAllTitles = async () => {
    try {
      const response = await axiosInstance.get('/titles/get-all-titles');
      // console.log('response: ', response);

      if (response) {
        setTitles(response?.data);
      };
    } catch (error) {
      console.error('Error: ', error);
    };
  };

  useEffect(() => {
    getAllTitles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log('registerFormData: ', registerFormData);

    try {
      const response = await axiosInstance.post(`http://localhost:3500/auth/register`, registerFormData);
      // console.log('response: ', response register);

      if (response) {
        localStorage.setItem('accessToken', response?.data?.accessToken);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));

        Cookies.set('refreshToken', response?.data?.refreshToken, { expires: 30 });

        toast.success(response?.status);
      };

      if (response.status === 201) {
        navigate('/');
      };
    } catch (error) {
      console.error('Error: ', error);
      toast.error(error?.message);
    };
  };

  return (
    <div className='h-screen flex justify-center items-center'>

      <form onSubmit={handleSubmit} className='w-96 max-w-96 border-2 rounded-lg flex flex-col gap-4 py-3 px-6'>

        <h3 className='text-center'>
          Register form
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
            value={registerFormData.username}
          />
        </div>

        <div className='w-full flex flex-col'>
          <label htmlFor="fullname">
            Fullname
          </label>
          <input
            type="text"
            id='fullname'
            name='fullname'
            className='input input-bordered input-md w-full'
            onChange={handleChange}
            value={registerFormData.fullname}
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
            value={registerFormData.password}
          />
        </div>

        <div className='w-full'>
          <label htmlFor="selectTitle">
            Choose title
          </label>
          <select
            className="select select-bordered w-full"
            id="selectTitle"
            onChange={handleChange}
            name="titleID" // Ensure this matches the state key
            value={registerFormData.titleID} // Ensure it binds to the correct state
          >
            {titles?.map((title) => (
              <option key={title.id} value={title.id}>
                {title.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className='btn btn-md w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-600 text-slate-100'
            type='submit'
          >
            Register
          </button>
        </div>

        <p
          className='underline mt-5 w-fit cursor-pointer'
          onClick={() => navigate('/login')}
        >
          Login
        </p>

      </form>

    </div>
  )
};

export default Register;