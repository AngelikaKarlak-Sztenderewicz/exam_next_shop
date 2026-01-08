"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

type LoginForm = {
  identifier: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+\d{1,3}\d{10}$/;

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const isEmail = EMAIL_REGEX.test(data.identifier);
    const isPhone = PHONE_REGEX.test(data.identifier);

    if (!isEmail && !isPhone) {
      alert("Enter valid email or phone number");
      return;
    }

    await signIn("credentials", {
      redirect: true,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-customGray rounded flex flex-col gap-4">
      <h2 className="text-3xl font-extrabold tracking-tight flex justify-center">
        <span className="text-orange-500">Nexus</span>
        <span className="text-white">Hub</span>
      </h2>

      {step === 1 && (
        <form
          onSubmit={handleSubmit((data) => {
            const isEmail = EMAIL_REGEX.test(data.identifier);
            const isPhone = PHONE_REGEX.test(data.identifier);

            if (!isEmail && !isPhone) {
              setError("identifier", {
                message: "Enter valid email or phone number",
              });
              return;
            }

            setStep(2);
          })}
          className="flex flex-col gap-2"
        >
          <h2>Sign in</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="identifier">Email or phone</label>
            <input
              id="identifier"
              {...register("identifier", { required: true })}
              placeholder="Email or phone"
              className="p-2 rounded"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm">Invalid email or phone</p>
            )}
          </div>

          <button type="submit" className="mt-4 w-full bg-blue-600 p-2 rounded">
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h3>Sign in</h3>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true, minLength: 8 })}
              placeholder="Password"
              className="p-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Invalid password</p>
            )}
          </div>

          <button className="mt-4 w-full bg-blue-600 p-2 rounded">
            Sign in
          </button>
        </form>
      )}

      <p className="text-sm text-gray-400 mt-4">
        New here? <a href="/register">Create account</a>
      </p>
    </div>
  );
}
