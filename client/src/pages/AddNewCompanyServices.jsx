import React, { useState } from "react";
import { useFormik } from "formik";
import ModalReusable from "../shared/ModalReusable";
import { axiosInstance } from "../api/axiosInstance";
import toast from 'react-hot-toast';

const AddNewCompanyServices = () => {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
      services: [{ description: "", image: null }],
    },
    onSubmit: (values) => {
      const formData = new FormData();

      // Filtering out empty services before submitting
      const services = values.services.filter((service) => service.description && service.image);

      const servicesDescriptions = services.map((service) => service.description);
      const servicesImages = services.map((service) => service.image);

      formData.append("services", JSON.stringify(servicesDescriptions));

      servicesImages.forEach((image) => {
        formData.append(`servicesImages`, image);
      });

      formData.append("companyID", localStorage.getItem("companyID") || "");

      // Log FormData to Debug
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // };

      const addNewCompanyOverview = async () => {
        try {
          const response = await axiosInstance({
            method: "POST",
            url: "/companies/add-new-company-services",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": "Bearer " + accessToken,
            },
          });

          // console.log("Services successfully added with status: ", response?.status);

          if (response) {
            toast.success(response?.status);
          }
        } catch (error) {
          console.error("Error posting data: ", error);
          toast.error(error?.message);
        }
      };

      addNewCompanyOverview();
    },
  });

  // Handle adding a new service
  const handleAddService = (e) => {
    e.preventDefault();

    formik.setFieldValue("services", [
      ...formik.values.services,
      { description: "", image: null },
    ]);

    setIsOpenConfirmModal(false);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        {/* Add service button */}
        <button
          className="btn btn-md w-fit text-slate-100 bg-purple-500 hover:bg-purple-400 active:bg-purple-500"
          type="button"
          onClick={() => setIsOpenConfirmModal(true)}
        >
          Add service +
        </button>

        {/* Display Added Services */}
        <div className="mt-4">
          {formik.values.services.filter(service => (service.description && service.image)).map((service, index) => (
            <div key={index} className="border p-2 rounded-md my-2 w-fit">
              <p>
                <strong>Description:</strong> {service.description}
              </p>
              {service.image && (
                <img
                  src={URL.createObjectURL(service.image)}
                  alt="Service Preview"
                  className="w-20 h-20 object-cover mt-2"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-md w-2/5 text-slate-100 bg-blue-500 hover:bg-blue-400 active:bg-blue-500"
        >
          Submit Services
        </button>

        {/* Modal */}
        <ModalReusable isOpenConfirmModal={isOpenConfirmModal} setIsOpenConfirmModal={setIsOpenConfirmModal}>
          {/* Service Image */}
          <div>
            <h5>Add service image:</h5>
            <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
              <label htmlFor="serviceImage" className="cursor-pointer">
                Add service image +
              </label>
              <input
                type="file"
                id="serviceImage"
                className="hidden"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue(
                    `services[${formik.values.services.length - 1}].image`,
                    file
                  );
                }}
              />
            </div>
          </div>

          {/* Service Description */}
          <div className="flex flex-col">
            <label htmlFor="serviceDescription" className="w-fit">
              <h5>Service description:</h5>
            </label>
            <input
              type="text"
              id="serviceDescription"
              className="input input-bordered input-md w-fit"
              value={formik.values.services[formik.values.services.length - 1].description}
              onChange={(event) =>
                formik.setFieldValue(`services[${formik.values.services.length - 1}].description`, event.target.value)
              }
            />
          </div>

          {/* Add service button */}
          <button
            type="button"
            className="btn btn-md w-fit bg-slate-400 hover:bg-slate-500 active:bg-slate-400"
            onClick={handleAddService}
          >
            Add service +
          </button>
        </ModalReusable>
        
      </form>
    </>
  );
};

export default AddNewCompanyServices;