"use client";

import { FC } from "react";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import useForgotPasswordMutation from "../hooks/use-forgot-password-mutation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Form: FC = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const validationSchema = z.object({
    email: z
      .string({ required_error: _(msg`Email is required`) })
      .email(_(msg`Invalid email format`)),
  });

  return (
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Can&lsquo;t sign in?</Trans>
      </h1>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
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
            toast.error(_(msg`Failed to send a recovery link.`));
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
                    <Trans>We&lsquo;ll send a recovery link to</Trans>
                  </p>
                  <Input
                    className="w-full"
                    type="text"
                    name="email"
                    value={values.email}
                    placeholder={_(msg`Enter email`)}
                    onChange={handleChange}
                    errorMessage={errors.email}
                    isError={!!errors.email}
                  />
                </div>
                <Button className="w-full">
                  <Trans>Send Recovery Link</Trans>
                </Button>
              </form>
            )}
          </>
        )}
      </Formik>
      <div className="w-full border-t my-6" />
      <Link href="/auth/signin">
        <p className="text-xs text-blue-700 text-center">
          <Trans>Return to sign in</Trans>
        </p>
      </Link>
    </div>
  );
};

export default Form;
