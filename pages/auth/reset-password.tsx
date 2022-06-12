import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Formik } from "formik";
import Loading from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import toast from "react-hot-toast";

import Input from "../../components/Input";
import Button from "../../components/Button";
import useResetPasswordMutation from "../../hooks/auth/use-reset-password-mutation";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password should have at least 8 characters.")
    .max(25, "Password should no more than 25 characters.")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm Password is mismatch")
    .required("Confirm Password is required"),
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const resetPasswordMutation = useResetPasswordMutation();

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Reset Password | Shoryuken</title>
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
              Reset your password
            </h1>
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  const { password, confirmPassword } = values;

                  await resetPasswordMutation.mutateAsync({
                    body: {
                      password,
                      confirm_password: confirmPassword,
                    },
                  });

                  await router.replace("/dashboard");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to reset your password.");
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
                      <Button className="w-full">Reset Password</Button>
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

export default ResetPasswordPage;
