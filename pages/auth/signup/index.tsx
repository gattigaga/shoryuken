import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Formik } from "formik";
import * as Yup from "yup";

import Input from "../../../components/Input";
import Button from "../../../components/Button";

const validationSchema = Yup.object({
  fullname: Yup.string()
    .min(5, "Full name should have at least 5 characters.")
    .max(50, "Full name should no more than 50 characters.")
    .required("Full name is required"),
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
    .oneOf([Yup.ref("password"), null], "Confirm password is not match")
    .required("Confirm password is required"),
});

const SignUpPage = () => {
  return (
    <div>
      <Head>
        <title>Sign Up | Shoryuken</title>
      </Head>

      <main className="py-12 md:bg-slate-50">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo-with-text.svg"
              alt="Shoryuken logo"
              width={240}
              height={64}
            />
          </div>
          <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
            <h1 className="font-semibold text-center text-slate-600 mb-6">
              Sign up for your account
            </h1>
            <Formik
              initialValues={{
                fullname: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur
              onSubmit={async (values, { setSubmitting }) => {}}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
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
                    <Link href="/">
                      <a className="text-blue-700">
                        Shoryuken Terms of Service
                      </a>
                    </Link>{" "}
                    and acknowledge the{" "}
                    <Link href="/">
                      <a className="text-blue-700">Privacy Policy</a>
                    </Link>
                    .
                  </p>
                  <Button className="w-full">Sign Up</Button>
                </form>
              )}
            </Formik>
            <div className="w-full border-t my-6" />
            <Link href="/">
              <a>
                <p className="text-xs text-blue-700 text-center">
                  Already have an account? Sign in
                </p>
              </a>
            </Link>
          </div>
          <p className="text-xs text-slate-500 text-center leading-normalm mt-8">
            This page is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://www.google.com/policies/privacy/"
              className="text-blue-700"
            >
              Privacy Policy
            </a>
            and{" "}
            <a
              href="https://www.google.com/policies/terms/"
              className="text-blue-700"
            >
              Terms of Service
            </a>
            apply
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
