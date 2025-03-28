import React, { useState, useEffect } from 'react';
import AddNewCompanyOverview from './AddNewCompanyOverview';
import AddNewCompanyServices from './AddNewCompanyServices';
import AddNewCompanyContacts from './AddNewCompanyContacts';
import { axiosInstance } from '../api/axiosInstance';

const AddNewCompany = () => {
  const [socialMediaTypes, setSocialMediaTypes] = useState([]);
  const [tab, setTab] = useState('overview');

  const getSocialMediaTypes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-social-media-types');

      if (response) {
        setSocialMediaTypes(response?.data);
      };

    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  useEffect(() => {
    getSocialMediaTypes();
  }, []);

  const Services = () => {
    if (tab === 'services') {
      if (localStorage.getItem('companyID')) {
        return <AddNewCompanyServices />
      };
      return <h3>Add company first, then you can add services.</h3>
    };
  };

  const Contacts = () => {
    if (tab === 'contacts') {
      if (localStorage.getItem('companyID')) {
        return <AddNewCompanyContacts socialMediaTypes={socialMediaTypes} />
      };
      return <h3>Add company first, then you can add contacts.</h3>
    }
  };

  return (
    <div className='px-8 pb-8 flex flex-col gap-4'>

      <div className='text-center'>
        <h4>
          Add new company
        </h4>
      </div>

      <div className='flex flex-col gap-8'>

        {/* Tabs */}
        <div className='flex gap-8'>
          <h4
            onClick={() => setTab('overview')}
            className={`${tab === 'overview' ? 'underline' : ''} cursor-pointer`}
          >
            Overview
          </h4>
          <h4
            onClick={() => setTab('services')}
            className={`${tab === 'services' ? 'underline' : ''} cursor-pointer`}
          >
            Services
          </h4>
          <h4
            onClick={() => setTab('contacts')}
            className={`${tab === 'contacts' ? 'underline' : ''} cursor-pointer`}
          >
            Contacts
          </h4>
        </div>

        {/* Overview */}
        {tab === 'overview'
          ? (
            <AddNewCompanyOverview
              socialMediaTypes={socialMediaTypes}
              setSocialMediaTypes={setSocialMediaTypes}
            />
          ) : null}

        {/* Services */}
        <Services />

        {/* Contacts */}
        <Contacts />

      </div>

    </div>
  )
};

export default AddNewCompany;