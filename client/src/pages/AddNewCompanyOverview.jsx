import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useFormik } from "formik";
import ModalReusable from "../shared/ModalReusable";
import toast from 'react-hot-toast';

const AddNewCompanyOverview = ({ socialMediaTypes }) => {
  const [companyCategories, setCompanyCategories] = useState([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const accessToken = localStorage.getItem('accessToken') || '';

  const userID = JSON.parse(localStorage.getItem('user'))?.id || '';

  const getAllCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "/categories/get-all-categories"
      );
      if (response) {
        setCompanyCategories(response?.data);
      }
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleAddCompanySocialLink = (e) => {
    e.preventDefault();

    formik.setFieldValue("companySocialLinks", [
      ...formik.values.companySocialLinks,
      { url: "" },
    ]);

    setIsOpenConfirmModal(false);
  };

  const companySocialLinks = [
    // { url: 'www.tiktok.com/ynamly-tech.com', type_id: 1 },
    // { url: 'www.instagram.com/ynamly-tech.com', type_id: 2 },
    { url: '', type_id: 1 },
  ];

  // [
  //   { url: 'www.tiktok.com/ynamly-tech.com', type_id: 1 },
  //   { url: 'www.instagram.com/ynamly-tech.com', type_id: 2 },
  // ];

  const formik = useFormik({
    initialValues: {
      companyLogo: null,
      companyName: '',
      foundedAt: '',
      companyCategory: '1',
      numberOfEmployees: '1',
      location: '',
      website: '',
      about: '',
      companySocialLinks: companySocialLinks,
      userID: userID,
    },
    onSubmit: (values) => {
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
      formData.append("userID", values.userID);

      // Log formData
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // };

      const addNewCompanyOverview = async () => {
        try {
          const response = await axiosInstance({
            method: 'POST',
            url: '/companies/add-new-company-overview',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + accessToken,
            },
          });

          if (response) {
            localStorage.setItem('companyID', response?.data?.companyID);
            toast.success(response?.status);
          };

          console.log('Company successfully added with status: ', response?.status);
        } catch (error) {
          console.error('Error posting data: ', error);
          toast.error(error?.message);
        };
      };

      addNewCompanyOverview();
    },
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={formik.handleSubmit}
    >

      {/* Company logo */}
      <div>
        <h5>Add company logo:</h5>
        <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
          <label htmlFor="companyLogo" className="cursor-pointer">
            Add company logo +
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
            ? <span className="font-bold text-red-700 text-xl">Please choose company logo.</span>
            : formik.values.companyLogo?.name}
        </p>
      </div>

      {/* Company name */}
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

      {/* Founded at */}
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

      {/* Company category */}
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

      {/* Number of employees */}
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

      {/* Location */}
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

      {/* Website */}
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

      {/* Company social links */}
      <div className="border-2 w-fit h-fit">
        {/* Add company social link button */}
        <button
          className='btn btn-md w-fit text-slate-100 bg-purple-500 hover:bg-purple-400 active:bg-purple-500'
          type='button'
          onClick={() => setIsOpenConfirmModal(true)}
        >
          Add company social link +
        </button>

        {/* Display Added social links */}
        <div className="mt-4">
          {formik.values.companySocialLinks.filter((socialLink) => (socialLink.url && socialLink.type_id)).map((socialLink, index) => (
            <div key={index} className="p-2 rounded-md my-2 w-fit flex flex-col gap-6">
              <div className="flex gap-6">
                <p>
                  <strong>URL:</strong> {socialLink.url}
                </p>
                <p>
                  <strong>Type:</strong> {socialLink.type_id}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <ModalReusable isOpenConfirmModal={isOpenConfirmModal} setIsOpenConfirmModal={setIsOpenConfirmModal}>
          <div className="flex flex-col">
            <label htmlFor="companySocialLinkUrl" className="w-fit">
              <h5>URL:</h5>
            </label>
            <input
              type="text"
              id="companySocialLinkUrl"
              className="input input-bordered input-md w-fit"
              value={formik.values.companySocialLinks[formik.values.companySocialLinks.length - 1].url}
              onChange={(event) =>
                formik.setFieldValue(`companySocialLinks[${formik.values.companySocialLinks.length - 1}].url`, event.target.value)
              }
            />
          </div>

          <select
            className="select select-bordered w-full max-w-xs"
            name={`companySocialLinks[${formik.values.companySocialLinks.length - 1}].type_id`}
            value={formik.values.companySocialLinks[formik.values.companySocialLinks.length - 1].type_id}
            onChange={(event) =>
              formik.setFieldValue(
                `companySocialLinks[${formik.values.companySocialLinks.length - 1}].type_id`,
                event.target.value
              )
            }
          >
            {socialMediaTypes.map((socialMedia) => (
              <option key={socialMedia.id} value={socialMedia.id}>
                {socialMedia.type}
              </option>
            ))}
          </select>

          {/* Add social link button */}
          <button
            type="button"
            className="btn btn-md w-fit bg-slate-400 hover:bg-slate-500 active:bg-slate-400"
            onClick={handleAddCompanySocialLink}
          >
            Add social link +
          </button>
        </ModalReusable>
      </div>

      {/* About */}
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

      {/* Submit button */}
      <div className="flex">
        <button
          className="btn btn-md w-4/5 bg-blue-600 hover:bg-blue-500 active:bg-blue-600 text-slate-100"
          type="submit"
        >
          Submit overview
        </button>
      </div>

    </form>
  );
};

export default AddNewCompanyOverview;