import React from 'react';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import { handleUndefinedField } from '../helpers/generalHelpers';
import { BASE_URL } from '../api/axiosInstance';
import toast from 'react-hot-toast';

const EditCompanyOverview = ({ socialMediaTypes }) => {
  const [companyCategories, setCompanyCategories] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});

  const accessToken = localStorage.getItem('accessToken') || '';

  const [searchParams, setSearchParams] = useSearchParams();

  const companyID = searchParams.get('companyID') || '';

  const getAllCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories/get-all-categories");
      if (response) {
        setCompanyCategories(response?.data);
      }
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  };

  const getCompanyOverview = async () => {
    try {
      const response = await axiosInstance.get(`/companies/get-company-overview/${companyID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      // console.log('getCompanyOverview response: ', response?.data);
      if (response) {
        setCompanyOverview(response?.data);
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  useEffect(() => {
    getAllCategories();
    getCompanyOverview();
  }, []);

  const companySocialLinks = [
    {
      id: 154,
      url: "www.whatsapp.com/8nokat.com",
      type_id: 3,
    },
    {
      id: 155,
      url: "www.link.com/8nokat.com",
      type_id: 4,
    },
  ];

  const formik = useFormik({
    initialValues: {

      companyLogo: null,
      companyName: handleUndefinedField(companyOverview?.company_name, ''),
      foundedAt: handleUndefinedField(companyOverview?.founded_date, ''),
      companyCategory: handleUndefinedField(companyOverview?.category_id, ''),
      numberOfEmployees: handleUndefinedField(companyOverview?.number_of_employees, ''),
      location: handleUndefinedField(companyOverview?.location, ''),
      website: handleUndefinedField(companyOverview?.website, ''),
      about: handleUndefinedField(companyOverview?.about, ''),
      // companySocialLinks: handleUndefinedField(companyOverview?.company_social_links, []),
      companySocialLinks: companySocialLinks,
      companyID: companyID,
      currentCompanyLogo: handleUndefinedField(companyOverview?.company_logo, ''),

      // companyLogo: null,
      // companyName: 'Ynamly Yorelge',
      // foundedAt: '2022-10-17',
      // companyCategory: '5',
      // numberOfEmployees: '255',
      // location: 'Argentina, Buenos Aires',
      // website: 'www.ynamly-yorelge.com',
      // about: 'Yorelge reliable technology services for your field.',
      // companySocialLinks: companySocialLinks,
      // companyID: companyID,
      // currentCompanyLogo: handleUndefinedField(companyOverview?.company_logo, ''),

      // companyLogo: null,
      // companyName: 'Ynamly Technology',
      // foundedAt: '2010-05-26',
      // companyCategory: '4',
      // numberOfEmployees: '368',
      // location: 'UK, London',
      // website: 'www.ynamly-tech.com',
      // about: 'Ynamly, best choice for your daily needs.',
      // companySocialLinks: companySocialLinks,
      // companyID: companyID,
      // currentCompanyLogo: handleUndefinedField(companyOverview?.company_logo, ''),

    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log('values: ', values);

      const formData = new FormData();

      const companySocialLinks = values.companySocialLinks.filter(socialLink => (socialLink.url && socialLink.type_id));

      formData.append("companyLogo", values.companyLogo);
      formData.append("companyName", values.companyName);
      formData.append("foundedAt", values.foundedAt);
      formData.append("companyCategory", values.companyCategory);
      formData.append("numberOfEmployees", values.numberOfEmployees);
      formData.append("location", values.location);
      formData.append("website", values.website);
      formData.append("about", values.about);
      formData.append("companySocialLinks", JSON.stringify(companySocialLinks));
      formData.append("companyID", values.companyID);
      formData.append("currentCompanyLogo", values.currentCompanyLogo);

      // Log formData
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // };

      const updateCompanyOverview = async () => {
        try {
          const response = await axiosInstance({
            method: 'PUT',
            url: '/companies/update-company-overview',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + accessToken,
            },
          });

          // console.log('Company overview successfully UPDATED with status: ', response?.status);

          if (response) {
            toast.success(response?.status);
          };
        } catch (error) {
          console.error('Error posting data: ', error);
          toast.error(error?.message);
        };
      };

      updateCompanyOverview();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

      {/* Company logo edit */}
      <div>
        <div className='flex gap-4 mb-6 items-center'>
          <img src={`${BASE_URL}${companyOverview?.company_logo}`} className='size-20' alt="current-company-logo" />
          <h5>
            Current company logo
          </h5>
        </div>
        <h5>Edit company logo:</h5>
        <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
          <label htmlFor="companyLogo" className="cursor-pointer">
            Edit company logo
          </label>
          <input
            type="file"
            id="companyLogo"
            name="companyLogo"
            className="hidden"
            onChange={(event) => (formik.setFieldValue("companyLogo", event.currentTarget.files[0]))}
          />
        </div>
        <p>
          {formik.values?.companyLogo === null
            ? <span>Company logo is not chosen.</span>
            : formik.values?.companyLogo?.name
          }
        </p>
      </div>

      {/* Company name edit */}
      <div className="flex flex-col">
        <label htmlFor="companyName" className="w-fit">
          <h5>Company name:</h5>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          className="input input-md input-bordered w-fit"
          onChange={formik.handleChange}
          value={formik.values.companyName}
        />
      </div>

      {/* Company founded at date edit */}
      <div className="flex flex-col">
        <label htmlFor="foundedAt" className="w-fit">
          <h5>Founded at:</h5>
        </label>
        <input
          type="date"
          id="foundedAt"
          name="foundedAt"
          className="input input-md input-bordered w-fit"
          onChange={formik.handleChange}
          value={formik.values.foundedAt}
        />
      </div>

      {/* Company category edit */}
      <div className="flex flex-col">
        <label htmlFor="companyCategory" className="w-fit">
          <h5>Company category:</h5>
        </label>
        <select
          className="select select-bordered w-fit"
          id="companyCategory"
          name="companyCategory"
          onChange={formik.handleChange}
          value={formik.values.companyCategory}
        >
          {companyCategories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Number of employees edit */}
      <div className="flex flex-col">
        <label htmlFor="numberOfEmployees" className="w-fit">
          <h5>Number of employees:</h5>
        </label>
        <input
          type="text"
          id="numberOfEmployees"
          name="numberOfEmployees"
          className="input input-bordered input-md w-fit"
          onChange={formik.handleChange}
          value={formik.values.numberOfEmployees}
        />
      </div>

      {/* Location edit */}
      <div className="flex flex-col">
        <label htmlFor="location" className="w-fit">
          <h5>Location:</h5>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          className="input input-bordered input-md w-fit"
          onChange={formik.handleChange}
          value={formik.values.location}
        />
      </div>

      {/* Website edit */}
      <div className="flex flex-col">
        <label htmlFor="website" className="w-fit">
          <h5>Website:</h5>
        </label>
        <input
          type="text"
          id="website"
          name="website"
          className="input input-bordered input-md w-fit"
          onChange={formik.handleChange}
          value={formik.values.website}
        />
      </div>

      {/* About edit */}
      <div className="flex flex-col">
        <label htmlFor="about" className="w-fit">
          <h5>About:</h5>
        </label>
        <textarea
          type="text"
          id="about"
          name="about"
          className="textarea textarea-bordered w-fit resize-none"
          cols={100}
          rows={5}
          onChange={formik.handleChange}
          value={formik.values.about}
        />
      </div>

      {/* Company social links edit */}
      <div className='flex gap-10'>
        <div className="flex flex-col">
          <label htmlFor="socialLinkUrl" className="w-fit">
            <h5>Social link URL:</h5>
          </label>
          <input
            type="text"
            id="socialLinkUrl"
            name="socialLinkUrl"
            className="input input-bordered input-md w-fit"
            onChange={formik.handleChange}
            value={formik.values.socialLinkUrl}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="socialMediaType" className="w-fit">
            <h5>Social media type:</h5>
          </label>
          <select
            className="select select-bordered w-fit"
            id="socialMediaType"
            name="socialMediaType"
            onChange={formik.handleChange}
            value={formik.values.socialMediaType}
          >
            {socialMediaTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit button */}
      <div className='mt-10'>
        <button
          className='btn btn-md w-2/5 text-slate-100 bg-blue-500 hover:bg-blue-400 active:bg-blue-500'
          type='submit'
        >
          Submit company changes
        </button>
      </div>

    </form>
  )
};

export default EditCompanyOverview;