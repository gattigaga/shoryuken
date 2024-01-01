"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import useResetPasswordMutation from "../hooks/use-reset-password-mutation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Form: FC = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const resetPasswordMutation = useResetPasswordMutation();

  const validationSchema = z
    .object({
      password: z
        .string({ required_error: _(msg`Password is required`) })
        .min(8, _(msg`Password should have at least 8 characters`))
        .max(25, _(msg`Password should no more than 25 characters`)),
      confirmPassword: z.string({
        required_error: _(msg`Confirm Password is required`),
      }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: _(msg`Confirm Password is mismatch`),
      path: ["confirmPassword"],
    });

  return (
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Reset your password</Trans>
      </h1>
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
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
            toast.error(_(msg`Failed to reset your password.`));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
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
                    placeholder={_(msg`Enter new password`)}
                    errorMessage={errors.password}
                    isError={!!touched.password && !!errors.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="mb-8">
                  <Input
                    className="w-full"
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    placeholder={_(msg`Enter new password again`)}
                    errorMessage={errors.confirmPassword}
                    isError={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <Button className="w-full">
                  <Trans>Reset Password</Trans>
                </Button>
              </form>
            )}
          </>
        )}
      </Formik>
      <hr className="w-full my-6" />
      <Link href="/auth/signin">
        <p className="text-xs text-blue-700 text-center">
          <Trans>Return to sign in</Trans>
        </p>
      </Link>
    </div>
  );
};

export default Form;
