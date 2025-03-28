import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { BASE_URL } from '../api/axiosInstance';

const CompanyDetails = () => {
  const tabs = ['Overview', 'Services', 'Contacts'];
  const [selectedTab, setSelectedTab] = useState('overview');
  const [companyDetails, setCompanyDetails] = useState({});

  const { companyID } = useParams();

  const getCompanyDetails = async () => {
    try {
      const response = await axiosInstance.get(`/companies/get-company-details/${companyID}`);
      // console.log('response: ', response?.data);
      if (response) {
        setCompanyDetails(response?.data);
      }
    } catch (error) {
      console.error('Error getting data: ', error);
    };
  };

  useEffect(() => {
    getCompanyDetails();
  }, []);

  return (
    <div className='px-6 pb-10 flex flex-col gap-6'>

      <div className='flex flex-col items-center mb-10'>

        <img
          src={`${BASE_URL}${companyDetails?.company_logo}`}
          alt="company-logo"
          className='h-24'
        />
        <h3>

          {companyDetails?.company_name}
        </h3>
      </div>

      <div className='flex gap-8'>
        {tabs.map((tab, index) => (
          <h4
            key={index}
            className={`cursor-pointer ${selectedTab.toLowerCase() === tab.toLowerCase() ? 'underline underline-offset-4' : ''}`}
            onClick={() => setSelectedTab(tab.toLowerCase())}
          >
            {tab}
          </h4>
        ))}
      </div>

      {selectedTab === 'overview'
        ? (
          <div>
            <h5>
              Founded at: {companyDetails?.founded_date}
            </h5>
            <h5>
              Category: {companyDetails?.category_name}
            </h5>
            <h5>
              Number of employees: {companyDetails?.number_of_employees}
            </h5>
            <h5>
              Location: {companyDetails?.location}
            </h5>
            <h5>
              Website: {companyDetails?.website}
            </h5>

            <div className='flex gap-3'>
              <h5>
                Company social links:
              </h5>
              {companyDetails?.company_social_links?.map((sm, index) => (
                <a
                  className='text-green-600 cursor-pointer'
                  key={index}
                  href={`${sm.url}`}
                  target='_blank'
                >
                  <h5>
                    {sm.type}
                  </h5>
                </a>
              ))}
            </div>

            <div>
              <h5>
                About:
              </h5>
              <p>
                {companyDetails?.about}
              </p>
            </div>

          </div>
        ) : null}

      {selectedTab === 'services'
        ? (
          <div className='flex flex-col gap-5'>
            {companyDetails?.services?.map((service) => (
              <div className='flex gap-4 items-center' key={service.id}>
                <img className='w-[50px] h-[50px] rounded-full' src={`${BASE_URL}${service.image}`} alt="" />
                <h5>
                  {service.description}
                </h5>
              </div>
            ))}
          </div>
        ) : null}

      {selectedTab === 'contacts'
        ? (
          <div className='flex gap-8'>
            {companyDetails?.contacts_info?.map((contact) => (
              <div className='border w-fit rounded-lg flex items-center gap-5 px-5 py-1' key={contact.id}>
                <img className='size-10 rounded-full' src={`${BASE_URL}${contact.avatar}`} alt="contact-person-avatar" />
                <div>
                  <h6>
                    {contact.fullname}
                  </h6>
                  <p>
                    {contact.title}
                  </p>
                  <p>
                    {contact.phone}
                  </p>
                  <div className='flex gap-2'>
                    {contact.social_links.map((sl) => (
                      <a
                        key={sl.id}
                        href={sl.url}
                        target='_blank'
                        className='text-sm text-green-500'
                      >
                        {sl.type}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

    </div>
  )
};

export default CompanyDetails;