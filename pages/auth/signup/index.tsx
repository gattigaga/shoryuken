import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Formik } from "formik";
import Loading from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import toast from "react-hot-toast";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useSignUpMutation from "../../../hooks/auth/use-sign-up-mutation";

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

const SignUpPage = () => {
  const router = useRouter();
  const signUpMutation = useSignUpMutation();

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Sign Up | Shoryuken</title>
      </Head>

      <main className="py-12">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <a>
                <Image
                  src="/images/logo-with-text.svg"
                  alt="Shoryuken logo"
                  width={240}
                  height={64}
                />
              </a>
            </Link>
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
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  const {
                    fullname,
                    username,
                    email,
                    password,
                    confirmPassword,
                  } = values;

                  await signUpMutation.mutateAsync({
                    body: {
                      fullname,
                      username,
                      email,
                      password,
                      confirm_password: confirmPassword,
                    },
                  });

                  sessionStorage.setItem("signupEmail", email);

                  await router.push("/auth/signup/email-sent");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to sign up.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <>
                  {isSubmitting ? (
                    <div className="flex justify-center py-4">
                      <Loading
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
                </>
              )}
            </Formik>
            <div className="w-full border-t my-6" />
            <Link href="/auth/signin">
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
            </a>{" "}
            apply
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
