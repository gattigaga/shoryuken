"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import toast from "react-hot-toast";

import useResetPasswordMutation from "../hooks/use-reset-password-mutation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password should have at least 8 characters.")
    .max(25, "Password should no more than 25 characters.")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm Password is mismatch")
    .required("Confirm Password is required"),
});

const Form: FC = () => {
  const router = useRouter();
  const resetPasswordMutation = useResetPasswordMutation();

  return (
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

          router.replace("/dashboard");
        } catch (error) {
          console.error(error);
          toast.error("Failed to reset your password.");
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
  );
};

export default Form;
