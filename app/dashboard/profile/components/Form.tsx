"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import * as Avatar from "@radix-ui/react-avatar";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useUpdateUserMutation from "../../../auth/account-details/hooks/use-update-user-mutation";
import { getInitials } from "../../../helpers/formatter";
import useUserQuery from "../../hooks/use-user-query";

const Form: FC = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const userQuery = useUserQuery();
  const updateUserMutation = useUpdateUserMutation();

  const validationSchema = z.object({
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
  });

  if (!userQuery.data) {
    return null;
  }

  return (
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Account Details</Trans>
      </h1>

      <Formik
        initialValues={{
          fullname: userQuery.data.fullname,
          username: userQuery.data.username,
          email: userQuery.data.email,
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        validateOnChange={false}
        validateOnBlur
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);

            const { fullname, username } = values;

            await updateUserMutation.mutateAsync({
              body: {
                fullname,
                username,
              },
            });

            await userQuery.refetch();
            router.replace("/dashboard");
          } catch (error) {
            console.error(error);
            toast.error(_(msg`Failed to update account details.`));
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
                <div className="flex justify-center items-center mb-8">
                  <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-16 h-16 rounded-full">
                    <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-blue-700 text-3xl text-white font-semibold">
                      {getInitials(userQuery.data.fullname)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </div>
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
                    disabled
                  />
                </div>
                <div className="mb-8">
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
