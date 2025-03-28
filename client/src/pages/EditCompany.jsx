import React, { useState, useEffect } from 'react';
import EditCompanyOverview from './EditCompanyOverview';
import EditCompanyServices from './EditCompanyServices';
import EditCompanyContacts from './EditCompanyContacts';
import Tab from '../shared/Tab';
import { axiosInstance } from '../api/axiosInstance';

const EditCompany = () => {
  const [tab, setTab] = useState('overview');
  const [socialMediaTypes, setSocialMediaTypes] = useState([]);

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

  return (
    <div className='p-8 pt-0 flex flex-col gap-8'>

      <div className='flex justify-center'>
        <h3 className='border-2 p-1 w-fit rounded-md'>
          Edit company
        </h3>
      </div>

      {/* Tabs */}
      <div className='flex gap-8'>
        <Tab tab={tab} setTab={setTab} tabStatus={'overview'} tabName={'Overview'} />
        <Tab tab={tab} setTab={setTab} tabStatus={'services'} tabName={'Services'} />
        <Tab tab={tab} setTab={setTab} tabStatus={'contacts'} tabName={'Contacts'} />
      </div>

      {tab === 'overview' ? <EditCompanyOverview socialMediaTypes={socialMediaTypes} /> : null}
      {tab === 'services' ? <EditCompanyServices /> : null}
      {tab === 'contacts' ? <EditCompanyContacts /> : null}

    </div>
  )
};

export default EditCompany;