import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance, BASE_URL } from '../api/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

const EditCompanyContacts = () => {
  const [contacts, setContacts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const companyID = searchParams.get('companyID') || '';

  const accessToken = localStorage.getItem('accessToken') || '';

  const socialLinks = [
    {
      id: 86,
      url: `www.tiktok.com/dowlet-didarov.com`,
      type_id: 1,
    },
    {
      id: 87,
      url: `www.instagram.com/dowlet-didarov.com`,
      type_id: 2,
    },
    {
      id: 88,
      url: `www.whatsapp.com/dowlet-didarov.com`,
      type_id: 3,
    },
  ];

  const getContacts = async () => {
    try {
      const response = await axiosInstance.get(`/companies/get-company-contacts/${companyID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      // console.log('response getContacts: ', response);

      if (response) {
        setContacts(response?.data);
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  useEffect(() => {
    getContacts();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: '',
      avatar: null,
      fullname: '',
      titleID: '1',
      phone: '9936',
      currentAvatar: '',
      socialLinks: socialLinks,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log('values: ', values);

      const currentAvatar = contacts?.filter(contact => (contact.id === Number(values.id)))[0]?.avatar;

      const formData = new FormData();

      formData.append('contactID', values.id);
      formData.append('currentAvatar', currentAvatar);
      formData.append('companyID', companyID);
      formData.append('fullname', values.fullname);
      formData.append('titleID', values.titleID);
      formData.append('phone', values.phone);
      formData.append('contactAvatar', values.avatar);
      formData.append('socialLinks', JSON.stringify(socialLinks));

      // Log formData
      // for (const [key, value] of formData.entries()){
      //   console.log(`${key}: `, value);
      // };

      const updateContact = async () => {
        try {
          const response = await axiosInstance({
            method: 'PUT',
            url: '/companies/update-company-contact',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + accessToken,
            },
          });

          // console.log('Contact UPDATED with response status: ', response?.status);

          if (response) {
            toast.success(response?.status);
          };
        } catch (error) {
          console.error('Error updating data: ', error);
          toast.error(error?.message);
        };
      };

      updateContact();
    },
  });

  return (
    <div className='flex flex-col gap-8'>

      {/* Current contacts */}
      <div className='flex flex-col gap-5 border-2 rounded-md p-3 w-fit'>
        <h4>
          Current contacts:
        </h4>
        {contacts.map((contact) => (
          <div className='flex gap-4 flex-col' key={contact.id}>
            <div className='flex gap-4 items-center'>
              <span className='text-orange-500 text-xl font-bold'>{contact.id}</span>
              <img src={BASE_URL + contact.avatar} alt="Contact Avatar" className='size-24 rounded-full' />
              <div className='flex gap-4 text-xl font-bold'>
                <span>{contact.fullname}</span>
                <span className='text-green-500'>{contact.phone}</span>
                <span className='text-purple-500'>{contact.title_id}</span>
              </div>
            </div>

            <div className='text-sm'>
              {contact?.contacts_social_links?.map(link => (
                <div className='w-fit flex gap-3' key={link.id}>
                  <span>{link.id}</span>
                  <span>{link.url}</span>
                  <span>{link.type}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Contacts to change */}
      <form className='flex flex-col gap-6 border-2 rounded-md p-2' onSubmit={formik.handleSubmit}>

        <h4>
          Services to change:
        </h4>

        {/* Avatar */}
        <div>
          <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
            <label htmlFor="avatar" className="cursor-pointer">
              Avatar:
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="hidden"
              onChange={(event) => (formik.setFieldValue("avatar", event.currentTarget.files[0]))}
            />
          </div>
          <p>
            {formik.values?.avatar === null
              ? <span>Service image is not chosen.</span>
              : formik.values?.avatar?.name
            }
          </p>
        </div>

        {/* Fullname */}
        <div className="flex flex-col">
          <label htmlFor="fullname" className="w-fit">
            <h5>fullname:</h5>
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="input input-bordered input-md w-fit"
            onChange={formik.handleChange}
            value={formik.values.fullname}
          />
        </div>

        {/* titleID */}
        <div className="flex flex-col">
          <label htmlFor="titleID" className="w-fit">
            <h5>title ID:</h5>
          </label>
          <input
            type="text"
            id="titleID"
            name="titleID"
            className="input input-bordered input-md w-fit"
            onChange={formik.handleChange}
            value={formik.values.titleID}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="w-fit">
            <h5>Phone:</h5>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="input input-bordered input-md w-fit"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
        </div>

        {/* Id */}
        <div className="flex flex-col">
          <label htmlFor="id" className="w-fit">
            <h5>id:</h5>
          </label>
          <input
            type="text"
            id="id"
            name="id"
            className="input input-bordered input-md w-fit"
            onChange={formik.handleChange}
            value={formik.values.id}
          />
        </div>

        <Button color={'blue'} type={'submit'}>
          Edit contacts
        </Button>

      </form>

    </div>
  )
};

export default EditCompanyContacts;