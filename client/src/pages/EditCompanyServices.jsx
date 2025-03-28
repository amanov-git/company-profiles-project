import React from 'react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../api/axiosInstance';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

const EditCompanyServices = () => {
  const [services, setServices] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const companyID = searchParams.get('companyID') || '';

  const accessToken = localStorage.getItem('accessToken') || '';

  const getServices = async () => {
    try {
      const response = await axiosInstance.get(`/companies/get-company-services/${companyID}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
      // console.log('response getServices: ', response);

      if (response) {
        setServices(response?.data);
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  useEffect(() => {
    getServices();
  }, []);

  const formik1 = useFormik({
    initialValues: {
      id: '',
      serviceImage: null,
      description: '',
      companyID: companyID,
      currentServiceImage: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // console.log('values: ', values);

      const formData = new FormData();

      const currentServiceImage = services?.filter(service => (service.id === Number(values.id)))[0]?.image;

      formData.append('id', values.id);
      formData.append('description', values.description);
      formData.append('companyID', companyID);
      formData.append('currentServiceImage', currentServiceImage);
      formData.append('serviceImage', values.serviceImage);

      // Log formData
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // };

      const updateService = async () => {
        try {
          const response = await axiosInstance({
            method: 'PUT',
            url: '/companies/update-company-service',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + accessToken,
            },
          });

          // console.log('Service successfully UPDATED with status: ', response?.status);

          if (response) {
            toast.success(response?.status);
          };
        } catch (error) {
          console.error('Error posting data: ', error);
          toast.error(error?.message);
        };
      };

      updateService();

    },
  });

  return (
    <div className='flex flex-col gap-8'>

      {/* Current services */}
      <div className='flex flex-col gap-5 border-2 rounded-md p-3'>
        <h4>
          Current services:
        </h4>
        {services.map((service) => (
          <div className='flex gap-4 items-center' key={service.id}>
            <img src={BASE_URL + service.image} alt="Service Image" className='size-24 rounded-full' />
            <h5>
              {service.description}
            </h5>
          </div>
        ))}
      </div>

      {/* Services to change */}
      <div className='border-2 rounded-md p-3 flex flex-col gap-4'>
        <h4>
          Services to change:
        </h4>

        <form className='flex flex-col gap-4' onSubmit={formik1.handleSubmit}>

          {/* Service image */}
          <div className=''>
            <div className="bg-green-600 w-fit rounded-md p-3 text-slate-100 border cursor-pointer">
              <label htmlFor="serviceImage" className="cursor-pointer">
                Service image:
              </label>
              <input
                type="file"
                id="serviceImage"
                name="serviceImage"
                className="hidden"
                onChange={(event) => (formik1.setFieldValue("serviceImage", event.currentTarget.files[0]))}
              />
            </div>
            <p>
              {formik1.values?.serviceImage === null
                ? <span>Service image is not chosen.</span>
                : formik1.values?.serviceImage?.name
              }
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="w-fit">
              <h5>Description:</h5>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="input input-bordered input-md w-fit"
              onChange={formik1.handleChange}
              value={formik1.values.description}
            />
          </div>

          {/* Service ID */}
          <div className="flex flex-col">
            <label htmlFor="id" className="w-fit">
              <h5>Service ID:</h5>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              className="input input-bordered input-md w-fit"
              onChange={formik1.handleChange}
              value={formik1.values.id}
            />
          </div>

          {/* Submit button */}
          <Button type={'submit'} color={'blue'}>
            Submit service
          </Button>

        </form>

      </div>

    </div>
  )
};

export default EditCompanyServices;