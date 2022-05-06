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
import useForgotPasswordMutation from "../../../hooks/auth/use-forgot-password-mutation";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Forgot Password | Shoryuken</title>
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
              Can&lsquo;t sign in?
            </h1>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  await forgotPasswordMutation.mutateAsync(values);

                  sessionStorage.setItem("forgotPasswordEmail", values.email);

                  await router.push("/auth/forgot-password/email-sent");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to send a recovery link.");
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
                        <p className="text-xs text-slate-600 font-semibold mb-2">
                          We&lsquo;ll send a recovery link to
                        </p>
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
                      <Button className="w-full">Send Recovery Link</Button>
                    </form>
                  )}
                </>
              )}
            </Formik>
            <div className="w-full border-t my-6" />
            <Link href="/auth/signin">
              <a>
                <p className="text-xs text-blue-700 text-center">
                  Return to sign in
                </p>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
