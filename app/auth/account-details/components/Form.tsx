"use client";

import Link from "next/link";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useUpdateUserMutation from "../hooks/use-update-user-mutation";

type Props = {
  defaultValues: {
    fullname: string;
    username: string;
    email: string;
  };
};

const Form: FC<Props> = ({ defaultValues }) => {
  const router = useRouter();
  const { _ } = useLingui();
  const updateUserMutation = useUpdateUserMutation();

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
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Fill up your account details</Trans>
      </h1>

      <Formik
        initialValues={{
          fullname: defaultValues.fullname,
          username: defaultValues.username,
          email: defaultValues.email,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        validateOnChange={false}
        validateOnBlur
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);

            const { fullname, username, password, confirmPassword } = values;

            await updateUserMutation.mutateAsync({
              body: {
                fullname,
                username,
                password,
                confirm_password: confirmPassword,
              },
            });

            router.replace("/dashboard");
          } catch (error) {
            console.error(error);
            toast.error(_(msg`Failed to submit account details.`));
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
                    name="fullname"
                    value={values.fullname}
                    placeholder={_(msg`Enter full name`)}
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
                    placeholder={_(msg`Enter username`)}
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
                    placeholder={_(msg`Enter email`)}
                    onChange={handleChange}
                    errorMessage={errors.email}
                    isError={!!errors.email}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <Input
                    className="w-full"
                    type="password"
                    name="password"
                    value={values.password}
                    placeholder={_(msg`Enter password`)}
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
                    placeholder={_(msg`Enter password again`)}
                    onChange={handleChange}
                    errorMessage={errors.confirmPassword}
                    isError={!!errors.confirmPassword}
                  />
                </div>
                <p className="text-xs text-slate-500 leading-normal mb-8 px-2">
                  <Trans>
                    By signing up, I accept the{" "}
                    <Link href="/" className="text-blue-700">
                      Shoryuken Terms of Service
                    </Link>{" "}
                    and acknowledge the{" "}
                    <Link href="/privacy-policy" className="text-blue-700">
                      Privacy Policy
                    </Link>
                    .
                  </Trans>
                </p>
                <Button className="w-full">
                  <Trans>Submit</Trans>
                </Button>
              </form>
            )}
          </>
        )}
      </Formik>
    </div>
  );
};

export default Form;
