"use client";

import { FC } from "react";
import { Formik } from "formik";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import Spinner from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useSignInMutation from "../hooks/use-sign-in-mutation";
import supabase from "../../../helpers/supabase";

const Form: FC = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const signInMutation = useSignInMutation();

  const validationSchema = z.object({
    email: z
      .string({ required_error: _(msg`Email is required`) })
      .email(_(msg`Invalid email format`)),
    password: z.string({ required_error: _(msg`Password is required`) }),
  });

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
      toast.error(_(msg`Failed to sign in with Google.`));
    }
  };

  return (
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Sign in to Shoryuken</Trans>
      </h1>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        validateOnChange={false}
        validateOnBlur={true}
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

            router.push("/dashboard");
          } catch (error) {
            console.error(error);
            toast.error(_(msg`Failed to sign in.`));
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
                    type="text"
                    name="email"
                    value={values.email}
                    placeholder={_(msg`Enter email`)}
                    errorMessage={errors.email}
                    isError={!!touched.email && !!errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="mb-8">
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
                <Button className="w-full">
                  <Trans>Sign In</Trans>
                </Button>
                <p className="text-xs text-center my-4 text-slate-600">
                  <Trans>OR</Trans>
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
                  <p className="ml-3">
                    <Trans>Sign in with Google</Trans>
                  </p>
                </Button>
              </form>
            )}
          </>
        )}
      </Formik>

      <hr className="w-full my-6" />
      <div className="flex justify-center items-center">
        <Link href="/auth/forgot-password">
          <p className="text-xs text-blue-700 text-center">
            <Trans>Can&lsquo;t sign in?</Trans>
          </p>
        </Link>
        <span className="mx-3 text-slate-600">&#8226;</span>
        <Link href="/auth/signup">
          <p className="text-xs text-blue-700 text-center">
            <Trans>Sign up for an account</Trans>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Form;
