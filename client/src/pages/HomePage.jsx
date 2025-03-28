import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';

const HomePage = () => {
  const [allCompanies, setAllCompanies] = useState([]);

  const navigate = useNavigate();

  const getAllCompanies = async () => {
    try {
      const response = await axiosInstance.get('/companies/get-all-companies');
      // console.log('response: ', response?.data);
      if (response) {
        setAllCompanies(response);
      };
    } catch (error) {
      console.error('Error getting data: ', error);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  return (
    <div className='px-4 pb-10 flex flex-col gap-5'>

      {allCompanies?.data?.map((category, index) => (
        <div key={index} className='flex flex-col gap-4'>

          <h4>
            {category.category}
          </h4>

          <div className='flex gap-10'>

            {category.companies.map((company) => (
              <div
                key={company.id}
                className='w-1/5 border-2 h-32 flex justify-center items-center rounded-md cursor-pointer'
                onClick={() => navigate(`/company-details/${company.id}`)}
              >
                <h5>
                  {company.company_name}
                </h5>
              </div>
            ))}

          </div>

        </div>
      ))}

    </div>
  )
};

export default HomePage;