import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Formik } from "formik";
import Loading from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import { addDays } from "date-fns";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import Input from "../../components/Input";
import Button from "../../components/Button";
import useSignInMutation from "../../hooks/auth/use-sign-in-mutation";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignInPage = () => {
  const router = useRouter();
  const signInMutation = useSignInMutation();

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Sign In | Shoryuken</title>
      </Head>

      <main className="py-12">
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
              Sign in to Shoryuken
            </h1>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  const response = await signInMutation.mutateAsync(values);
                  const accessToken = response.session.access_token;

                  Cookies.set("access_token", accessToken, {
                    expires: addDays(new Date(), 7),
                    path: "/",
                  });

                  await router.push("/dashboard");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to sign in.");
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
                          type="email"
                          name="email"
                          value={values.email}
                          placeholder="Enter email"
                          onChange={handleChange}
                          errorMessage={errors.email}
                          isError={!!errors.email}
                        />
                      </div>
                      <div className="mb-8">
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
                      <Button className="w-full">Sign In</Button>
                    </form>
                  )}
                </>
              )}
            </Formik>
            <div className="w-full border-t my-6" />
            <div className="flex justify-center items-center">
              <Link href="/auth/forgot-password">
                <a>
                  <p className="text-xs text-blue-700 text-center">
                    Can&lsquo;t sign in?
                  </p>
                </a>
              </Link>
              <span className="mx-3 text-slate-600">&#8226;</span>
              <Link href="/auth/signup">
                <a>
                  <p className="text-xs text-blue-700 text-center">
                    Sign up for an account
                  </p>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
