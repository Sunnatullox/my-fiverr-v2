import ImageUpload from "../../../components/ImageUpload";
import { categories } from "../../../utils/categories";
import { ADD_GIG_ROUTE, API_URL } from "../../../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../../context/StateContext";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const gigSchema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
  subCategory: yup.string().required("Subcategory is Required"),
  time: yup.number().required("Time is Required"),
  revisions: yup.number().required("Revisoons is Required"),
  features: yup
    .array()
    .min(1, "Pick at least one feature")
    .required("feature is Required"),
  price: yup.number().required("Price is Required"),
  shortDesc: yup.string().required("shortDesc is Required"),
});


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function CreateGigs() {
  const [cookies] = useCookies();
  const router = useRouter();
  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900  dark:text-white";
  const [files, setFile] = useState([]);
  const [features, setfeatures] = useState([]);
  const [subCategorys, setSubCategorys] = useState([]);
  const [{ categorys }, dispatch] = useStateProvider();
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuillLoaded(true);
  }, []);

  useEffect(() => {
    formik.values.description = description ? description : "";
  }, [description]);

  useEffect(() => {
    formik.values.features = features.length > 0 ?  features :[]
  }, [features]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      time: null,
      revisions: null,
      features: [],
      price: null,
      shortDesc: "",
    },
    validationSchema: gigSchema,
    onSubmit: (values) => {
      addGig(values)
    },
  });

  const [data, setData] = useState("");
  const removeFeature = (index) => {
    const clonedFeatures = [...features];
    clonedFeatures.splice(index, 1);
    setfeatures(clonedFeatures);
  };

  const handleChange = (e) => {
    setData(e.target.value);
  };

  const addFeature = () => {
    if (data !== "") {
      setfeatures([...features, data]);
      formik.values.features = [...formik.values.features, data];
      setData("");
    }
  };

  useEffect(() => {
    getSubCategorys();
  }, [formik.values.category]);

  const getSubCategorys = async () => {
    if (formik.values.category !== "") {
      try {
        const { data } = await axios.get(
          `${API_URL}/get-sub-category?slug=${formik.values.category}`
        );
        setSubCategorys(data.subCategorys);
      } catch (error) {
         if(error.response){
        toast.error(error.response.data.message)
      }
      }
    }
  };


  const addGig = async (value) => {
    try {
      
      const { price, revisions, time, title, category, shortDesc, subCategory } = value;
      if(files.length === 0){
        return setError("Required is Image")
      }else if (
        subCategory &&
        description &&
        title &&
        features.length &&
        files.length &&
        price > 0 &&
        shortDesc.length &&
        revisions > 0 &&
        time > 0 &&
        category
      ) {
        const formData = new FormData();
        files?.forEach((file) => formData.append("images", file));
        const gigData = {
          title,
          description,
          category,
          subCategory,
          features,
          price,
          revisions,
          time,
          shortDesc,
        };
        const response = await axios.post(ADD_GIG_ROUTE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
          params: gigData,
        });
        if (response.status === 201) {
          router.push("/seller/gigs");
        }
      };
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
    }

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h1 className="text-6xl text-gray-900 mb-5">Create a new Gig</h1>
      <h3 className="text-3xl text-gray-900 mb-5">
        Enter the details to create the gig
      </h3>
      <form  onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mt-10">
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              name="title"
              type="text"
              id="title"
              className={inputClassName}
              placeholder="e.g. I will do something I'm really good at"
              value={formik.values.title}
              onChange={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
            />
            <span className="text-xs text-red-500">
              {formik.touched.title && formik.errors.title}
            </span>
          </div>
          <div className="grid grid-flow-row-dense grid-cols-3 gap-2">
            <div className="col-span-2">
              <label htmlFor="categories" className={labelClassName}>
                Select a Category
              </label>
              <select
                id="categories"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange("category")}
                onBlur={formik.handleBlur("category")}
              >
                <option hidden selected>
                  Other
                </option>
                {categorys
                  .sort(function (a, b) {
                    if (a.title > b.title) {
                      return 1;
                    }
                    if (a.title < b.title) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((item) => (
                    <option key={item._id} value={item.slug}>
                      {item.title}
                    </option>
                  ))}
              </select>
              <span className="text-xs text-red-500">
                {formik.touched.category && formik.errors.category}
              </span>
            </div>
            <div>
              <label htmlFor="categories" className={labelClassName}>
                Select sub menu
              </label>
              <select
                id="categories"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
                name="subCategory"
                disabled={
                  subCategorys.length === 0 && formik.values.category === ""
                }
                value={formik.values.subCategory}
                onChange={formik.handleChange("subCategory")}
                onBlur={formik.handleBlur("subCategory")}
              >
                <option hidden selected>
                  Other
                </option>
                {subCategorys
                  ?.sort(function (a, b) {
                    if (a.title > b.title) {
                      return 1;
                    }
                    if (a.title < b.title) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((item) => (
                    <option key={item._id} value={item.slug}>
                      {item.title}
                    </option>
                  ))}
              </select>
              <span className="text-xs text-red-500">
                {formik.touched.subCategory && formik.errors.subCategory}
              </span>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig Description
          </label>
          {quillLoaded ? (
            <ReactQuill
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write a short description"
              theme="snow"
              name="description"
              value={description}
              onChange={(e) => setDescription(e)}
            />
          ) : null}
          <span className="text-xs text-red-500">
            {formik.touched.description && formik.errors.description}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="delivery">Delivery Day</label>
            <input
              type="number"
              className={inputClassName}
              id="delivery"
              name="time"
              placeholder="Minimum Delivery Time"
              value={formik.values.time}
              onChange={formik.handleChange("time")}
              onBlur={formik.handleBlur("time")}
            />
            <span className="text-xs text-red-500">
              {formik.touched.time && formik.errors.time}
            </span>
          </div>
          <div>
            <label htmlFor="revision" className={labelClassName}>
              Revisions
            </label>
            <input
              type="number"
              id="revision"
              className={inputClassName}
              placeholder="Max Number of Revisions"
              name="revisions"
              value={formik.values.revisions}
              onChange={formik.handleChange("revisions")}
              onBlur={formik.handleBlur("revisions")}
            />
            <span className="text-xs text-red-500">
              {formik.touched.revisions && formik.errors.revisions}
            </span>
          </div>
        </div> 
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Features
            </label>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="text"
                id="features"
                className={inputClassName}
                placeholder="Enter a Feature Name"
                name="feature"
                value={data}
                onChange={handleChange}
              />
              <button
                type="button"
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800  font-medium  text-lg px-10 py-3 rounded-md "
                onClick={addFeature}
              >
                Add
              </button>
            </div>
            <span className="text-xs text-red-500">
              {formik.touched.features && formik.errors.features}
              </span>
            <ul className="flex gap-2 flex-wrap">
              {features.map((feature, index) => {
                return (
                  <li
                    key={feature + index.toString()}
                    className="flex gap-2 items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200"
                  >
                    <span>{feature}</span>
                    <span
                      className="text-red-700"
                      onClick={() => removeFeature(index)}
                    >
                      X
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <label htmlFor="image" className={labelClassName}>
              Gig Images
            </label>
            <div>
              <ImageUpload error={error} files={files} setFile={setFile} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              type="text"
              className={`${inputClassName} w-1/5`}
              id="shortDesc"
              placeholder="Enter a short description."
              name="shortDesc"
              value={formik.values.shortDesc}
              onChange={formik.handleChange("shortDesc")}
              onBlur={formik.handleBlur("shortDesc")}
            />
            <span className="text-xs text-red-500">
            {formik.touched.shortDesc && formik.errors.shortDesc}
            </span>
          </div>
          <div>
            <label htmlFor="price" className={labelClassName}>
              Gig Price ( $ )
            </label>
            <input
              type="number"
              className={`${inputClassName} w-1/5`}
              id="price"
              placeholder="Enter a price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange("price")}
              onBlur={formik.handleBlur("price")}
            />
            <span className="text-xs text-red-500">
            {formik.touched.price && formik.errors.price}
            </span>
          </div>
        </div>
        <div>
          <button
            className="border   text-lg font-semibold px-5 py-3   border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGigs;
