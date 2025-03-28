import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import Button from '../shared/Button';
import ModalReusable from '../shared/ModalReusable';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [companies, setCompanies] = useState([]);
  const [companyID, setCompanyID] = useState(null);
  const [isOpenDeleteCompanyConfirmModal, setIsOpenDeleteCompanyConfirmModal] = useState(false);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken') || '';

  const getCompanies = async () => {
    try {
      const response = await axiosInstance.get('/companies/get-admin-companies', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      // console.log('response getAdminCompanies: ', response);

      if (response) {
        setCompanies(response?.data);
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
      toast.error(error?.message);
    };
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const deleteCompany = async () => {
    try {
      const response = await axiosInstance.delete(`/companies/delete-company/${companyID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      // console.log('response deleteCompany status: ', response?.status);

      if (response) {
        toast.success(response?.status);
      };
    } catch (error) {
      console.error('Error deleting data: ', error);
      toast.error(error?.message);
    };

    setIsOpenDeleteCompanyConfirmModal(false);

    getCompanies();
  };

  const handleDeleteCompanyButton = (id) => {
    setIsOpenDeleteCompanyConfirmModal(true);
    setCompanyID(id);
  };

  return (
    <div className='p-8 flex flex-col gap-10'>

      <h3>
        Admin Panel
      </h3>

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

export default AdminPanel;