"use client";

import { FC } from "react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useSignUpMutation from "../hooks/use-sign-up-mutation";

const Form: FC = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const signUpMutation = useSignUpMutation();

  const validationSchema = z
    .object({
      fullname: z
        .string({ required_error: _(msg`Full Name is required`) })
        .min(5, _(msg`Full Name should have at least 5 characters`))
        .max(50, _(msg`Full Name should no more than 50 characters`)),
      username: z
        .string({ required_error: _(msg`Username is required`) })
        .min(8, _(msg`Username should have at least 8 characters`))
        .max(15, _(msg`Username should no more than 15 characters`)),
      email: z
        .string({ required_error: _(msg`Email is required`) })
        .email(_(msg`Invalid email format.`)),
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
    <>
      <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
        <h1 className="font-semibold text-center text-slate-600 mb-6">
          <Trans>Sign up for your account</Trans>
        </h1>

        <Formik
          initialValues={{
            fullname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={toFormikValidationSchema(validationSchema)}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true);

              const { email } = values;

              await signUpMutation.mutateAsync({
                body: values,
              });

              sessionStorage.setItem("signupEmail", email);

              router.push("/auth/signup/email-sent");
            } catch (error) {
              console.error(error);
              toast.error(_(msg`Failed to sign up.`));
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
                      name="fullname"
                      value={values.fullname}
                      placeholder={_(msg`Enter full name`)}
                      errorMessage={errors.fullname}
                      isError={!!touched.fullname && !!errors.fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      className="w-full"
                      name="username"
                      value={values.username}
                      placeholder={_(msg`Enter username`)}
                      errorMessage={errors.username}
                      isError={!!touched.username && !!errors.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      className="w-full"
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder={_(msg`Enter email`)}
                      errorMessage={errors.email}
                      isError={!!touched.email && !!errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      className="w-full"
                      type="password"
                      name="password"
                      value={values.password}
                      placeholder={_(msg`Enter password`)}
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
                      placeholder={_(msg`Enter password again`)}
                      errorMessage={errors.confirmPassword}
                      isError={
                        !!touched.confirmPassword && !!errors.confirmPassword
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <p className="text-xs text-slate-500 leading-normal mb-8 px-2">
                    <Trans>
                      By signing up, I accept the{" "}
                      <Link href="/" className="text-blue-700">
                        Shoryuken Terms of Service
                      </Link>{" "}
                      and acknowledge the{" "}
                      <Link href="/" className="text-blue-700">
                        Privacy Policy
                      </Link>
                      .
                    </Trans>
                  </p>

                  <Button className="w-full">
                    <Trans>Sign Up</Trans>
                  </Button>
                </form>
              )}
            </>
          )}
        </Formik>

        <hr className="w-full my-6" />
        <Link href="/auth/signin">
          <p className="text-xs text-blue-700 text-center">
            <Trans>Already have an account? Sign in</Trans>
          </p>
        </Link>
      </div>
    </>
  );
};

export default Form;
