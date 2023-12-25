"use client";

import Link from "next/link";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import toast from "react-hot-toast";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useUpdateUserMutation from "../hooks/use-update-user-mutation";

const validationSchema = Yup.object({
  fullname: Yup.string()
    .min(5, "Full Name should have at least 5 characters.")
    .max(50, "Full Name should no more than 50 characters.")
    .required("Full Name is required"),
  username: Yup.string()
    .min(8, "Username should have at least 8 characters.")
    .max(15, "Username should no more than 15 characters.")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should have at least 8 characters.")
    .max(25, "Password should no more than 25 characters.")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm Password is mismatch")
    .required("Confirm Password is required"),
});

type Props = {
  defaultValues: {
    fullname: string;
    username: string;
    email: string;
  };
};

const Form: FC<Props> = ({ defaultValues }) => {
  const router = useRouter();
  const updateUserMutation = useUpdateUserMutation();

  return (
    <Formik
      initialValues={{
        fullname: defaultValues.fullname,
        username: defaultValues.username,
        email: defaultValues.email,
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { fullname, username, password, confirmPassword } = values;

          await updateUserMutation.mutateAsync({
            body: {
              fullname,
              username,
              password,
              confirm_password: confirmPassword,
            },
          });

          router.replace("/dashboard");
        } catch (error) {
          console.error(error);
          toast.error("Failed to submit account details.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <>
          {isSubmitting ? (
            <div className="flex justify-center py-4">
              <Spinner
                height={36}
                width={4}
                radius={8}
                margin={2}
                color="rgb(29 78 216)"
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  className="w-full"
                  name="fullname"
                  value={values.fullname}
                  placeholder="Enter full name"
                  onChange={handleChange}
                  errorMessage={errors.fullname}
                  isError={!!errors.fullname}
                />
              </div>
              <div className="mb-4">
                <Input
                  className="w-full"
                  name="username"
                  value={values.username}
                  placeholder="Enter username"
                  onChange={handleChange}
                  errorMessage={errors.username}
                  isError={!!errors.username}
                />
              </div>
              <div className="mb-4">
                <Input
                  className="w-full"
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="Enter email"
                  onChange={handleChange}
                  errorMessage={errors.email}
                  isError={!!errors.email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Input
                  className="w-full"
                  type="password"
                  name="password"
                  value={values.password}
                  placeholder="Enter password"
                  onChange={handleChange}
                  errorMessage={errors.password}
                  isError={!!errors.password}
                />
              </div>
              <div className="mb-8">
                <Input
                  className="w-full"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  placeholder="Enter password again"
                  onChange={handleChange}
                  errorMessage={errors.confirmPassword}
                  isError={!!errors.confirmPassword}
                />
              </div>
              <p className="text-xs text-slate-500 leading-normal mb-8 px-2">
                By signing up, I accept the{" "}
                <Link href="/" className="text-blue-700">
                  Shoryuken Terms of Service
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="/" className="text-blue-700">
                  Privacy Policy
                </Link>
                .
              </p>
              <Button className="w-full">Submit</Button>
            </form>
          )}
        </>
      )}
    </Formik>
  );
};

export default Form;
