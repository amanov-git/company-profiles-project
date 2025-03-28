import React from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import ModalReusable from '../shared/ModalReusable';
import toast from 'react-hot-toast';

const UserAccount = () => {
  const [companies, setCompanies] = useState([]);
  const [isOpenDeleteCompanyConfirmModal, setIsOpenDeleteCompanyConfirmModal] = useState(false);
  const [companyID, setCompanyID] = useState(null);

  const { userID } = useParams();

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken') || '';

  const userName = JSON.parse(localStorage.getItem('user'))?.username;

  const getUserCompanies = async () => {
    try {
      const response = await axiosInstance.get(`/companies/get-user-companies/${userID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (response) {
        setCompanies(response?.data);
      };

    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  const deleteCompany = async () => {
    try {
      const response = await axiosInstance.delete(`/companies/delete-company/${companyID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
      });
      // console.log('response deleteCompany status: ', response?.status);

      if (response) {
        toast.success(response?.status);
      }
    } catch (error) {
      console.error('Error deleting data: ', error);
      toast.error(error?.message);
    };

    setIsOpenDeleteCompanyConfirmModal(false);

    getUserCompanies();
  };

  const handleDeleteCompanyButton = (id) => {
    setIsOpenDeleteCompanyConfirmModal(true);
    setCompanyID(id);
  };

  useEffect(() => {
    getUserCompanies();
  }, []);

  return (
    <div className='px-8 flex flex-col gap-6'>

      <div>
        <h4 className='border py-1 px-3 w-fit rounded-md'>
          {userName}
        </h4>
      </div>

      {/* Companies */}
      <div className='flex flex-col gap-6'>
        {companies?.map((company, index) => (
          <div className='font-bold text-xl flex gap-4' key={index}>
            <span>
              {company.company_name}
            </span>
            <span className='text-green-500'>
              {company.id}
            </span>

            <button
              className='btn btn-sm text-slate-100 bg-blue-500 hover:bg-blue-400 active:bg-blue-500'
              onClick={() => navigate(`/edit-company?companyID=${company.id}`)}
            >
              Edit company
            </button>

            <Button
              type={'button'} color={'red'} size='btn-sm'
              onClick={() => handleDeleteCompanyButton(company.id)}
            >
              Delete company
            </Button>

          </div>

        ))}
      </div>

      {/* Modal. Delete company confirmation */}
      <ModalReusable isOpenConfirmModal={isOpenDeleteCompanyConfirmModal} setIsOpenConfirmModal={setIsOpenDeleteCompanyConfirmModal}>

        <div className='flex flex-col gap-10'>
          <h5>
            Are you sure you want to delete company?
          </h5>
          <div className='flex justify-end gap-5'>
            <Button type={'button'} color={'blue'} onClick={() => deleteCompany(companyID)}>
              Yes
            </Button>
            <Button type={'button'} color={'blue'} onClick={() => setIsOpenDeleteCompanyConfirmModal(false)}>
              No
            </Button>
          </div>
        </div>

      </ModalReusable>

    </div>
  )
};

export default UserAccount;