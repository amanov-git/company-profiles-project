import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { useFormik } from 'formik';
import Button from '../shared/Button';

const SearchCompanies = () => {
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      searchText: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log('values: ', values);

      const searchCompanies = async () => {
        try {
          const response = await axiosInstance.get(`/companies/get-search-companies?searchText=${values.searchText.trim()}`);
          // console.log('response searchCompanies: ', response);

          if (response) {
            setCompanies(response?.data);
          };
        } catch (error) {
          console.error('Error fetching data: ', error);
        };
      };

      searchCompanies()

      // if (values.searchText.length > 2) {
      //   searchCompanies();
      // } else {
      //   setCompanies([]);
      // };
    },
  });

  // console.log('companies: ', companies);

  return (
    <div className='p-8 flex flex-col gap-8'>

      <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>

        <div className="flex flex-col">
          <label htmlFor="searchText" className="w-fit">
            <h5>Search:</h5>
          </label>
          <input
            type="text"
            id="searchText"
            name="searchText"
            className="input input-md input-bordered w-fit"
            onChange={formik.handleChange}
            value={formik.values.searchText}
          />
        </div>

        <Button type={'submit'} color={'blue'}>
          Search companies
        </Button>

      </form>

      <div className='flex flex-col gap-4'>
        {companies?.map((company, index) => (
          <div key={index} className='flex flex-col'>
            <h4>
              {company.category_name}
            </h4>
            <div className='flex flex-col gap-1'>
              {company?.companies?.map((comp, index) => (
                <h5 key={index} className='text-green-500 cursor-pointer' onClick={() => navigate(`/company-details/${comp.id}`)}>
                  {comp.company_name}
                </h5>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
};

export default SearchCompanies;