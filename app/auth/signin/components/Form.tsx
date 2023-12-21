"use client";

import { FC } from "react";
import { Formik } from "formik";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import Loading from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";
import * as Yup from "yup";

import Input from "../../components/Input";
import Button from "../../../components/Button";
import useSignInMutation from "../hooks/use-sign-in-mutation";
import supabase from "../../../../helpers/supabase";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

type Props = {};

const Form: FC<Props> = () => {
  const router = useRouter();
  const signInMutation = useSignInMutation();

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
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur
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

          await router.push("/dashboard");
        } catch (error) {
          console.error(error);
          toast.error("Failed to sign in.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
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
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="Enter email"
                  onChange={handleChange}
                  errorMessage={errors.email}
                  isError={!!errors.email}
                />
              </div>
              <div className="mb-8">
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
              <Button className="w-full">Sign In</Button>
              <p className="text-xs text-center my-4 text-slate-600">OR</p>
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
                <p className="ml-3">Sign in with Google</p>
              </Button>
            </form>
          )}
        </>
      )}
    </Formik>
  );
};

export default Form;
