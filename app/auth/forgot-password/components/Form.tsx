"use client";

import { FC } from "react";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import useForgotPasswordMutation from "../../../../hooks/auth/use-forgot-password-mutation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const Form: FC = () => {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();

  return (
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

          await forgotPasswordMutation.mutateAsync({
            body: values,
          });

          sessionStorage.setItem("forgotPasswordEmail", values.email);
          router.push("/auth/forgot-password/email-sent");
        } catch (error) {
          console.error(error);
          toast.error("Failed to send a recovery link.");
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
  );
};

export default Form;
