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
import supabase from "../../helpers/supabase";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignInPage = () => {
  const router = useRouter();
  const signInMutation = useSignInMutation();

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signIn({
        provider: "google",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Sign In | Shoryuken</title>
      </Head>

      <main className="py-12">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/images/logo-with-text.svg"
                alt="Shoryuken logo"
                width={240}
                height={64}
              />
            </Link>
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

                  const accessToken = await signInMutation.mutateAsync({
                    body: values,
                  });

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
                      <p className="text-xs text-center my-4 text-slate-600">
                        OR
                      </p>
                      <Button
                        className="w-full flex items-center justify-center bg-slate-50 shadow-md text-slate-500 hover:bg-slate-100"
                        backgroundColor={["bg-slate-50", "bg-slate-100"]}
                        textColor="text-slate-500"
                        type="button"
                        onClick={signInWithGoogle}
                      >
                        <Image
                          src="/images/logo-google.png"
                          alt="Google Logo"
                          width={16}
                          height={16}
                        />
                        <p className="ml-3">Sign in with Google</p>
                      </Button>
                    </form>
                  )}
                </>
              )}
            </Formik>
            <div className="w-full border-t my-6" />
            <div className="flex justify-center items-center">
              <Link href="/auth/forgot-password">
                <p className="text-xs text-blue-700 text-center">
                  Can&lsquo;t sign in?
                </p>
              </Link>
              <span className="mx-3 text-slate-600">&#8226;</span>
              <Link href="/auth/signup">
                <p className="text-xs text-blue-700 text-center">
                  Sign up for an account
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
