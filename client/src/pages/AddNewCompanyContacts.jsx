import React from 'react';
import { useFormik } from 'formik';
import { axiosInstance } from '../api/axiosInstance';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

const AddNewCompanyContacts = () => {
  const accessToken = localStorage.getItem('accessToken') || '';
  const companyID = localStorage.getItem('companyID') || '';

  const contactSocialLinks = [
    {
      url: 'www.tiktok.com/abdy-abdyyev.com',
      type_id: 1,
    },
    {
      url: 'www.instagram.com/abdy-abdyyev.com',
      type_id: 2,
    },
    {
      url: 'www.whatsapp.com/abdy-abdyyev.com',
      type_id: 3,
    },
  ];

  const formik = useFormik({
    initialValues: {
      avatar: null,
      fullname: '',
      titleID: 1,
      phone: 9936,
      companyID: companyID,
      contactSocialLinks: contactSocialLinks,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log('values: ', values);

      const formData = new FormData();

      formData.append('contactAvatar', values.avatar);
      formData.append('fullname', values.fullname);
      formData.append('titleID', values.titleID);
      formData.append('phone', values.phone);
      formData.append('companyID', values.companyID);
      formData.append('contactSocialLinks', JSON.stringify(values.contactSocialLinks));

      // Log formData
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: `, value);
      // };

      const addContact = async () => {
        try {
          const response = await axiosInstance({
            method: 'POST',
            url: '/companies/add-new-company-contact',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + accessToken,
            }
          });

          if (response) {
            // console.log('contact ADDED with status: ', response?.status);
            toast.success(response?.status);
          };

        } catch (error) {
          console.error('Error posting data: ', error);
          toast.error(error?.message);
        };
      };

      addContact();
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>

        {/* Avatar */}
        <div className=''>
          <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
            <label htmlFor="avatar" className="cursor-pointer">
              Avatar
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
              ? <span>Avatar is not chosen.</span>
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

        {/* Title ID */}
        <div className="flex flex-col">
          <label htmlFor="titleID" className="w-fit">
            <h5>Title ID:</h5>
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

        {/* phone */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="w-fit">
            <h5>phone:</h5>
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

        {/* Submit button */}
        <Button type={'submit'} color={'blue'}>
          Add contact
        </Button>

      </form>
    </div>
  )
};

export default AddNewCompanyContacts;