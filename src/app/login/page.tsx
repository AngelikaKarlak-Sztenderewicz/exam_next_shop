'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/sse';
import { Button } from '@/components/ui';

type LoginForm = {
  identifier: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+\d{1,3}\d{10}$/;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async () => {
    const { identifier, password } = getValues();

    const res = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    if (!res || res.error) {
      setError('password', {
        message: 'Invalid email/phone or password',
      });

      notify({
        type: 'error',
        message: 'Invalid login credentials',
      });

      return;
    }

    router.push('/');
  };

  return (
    <div
      className="flex flex-col items-center justify-start
                    py-10 sm:p-20 "
    >
      <h2 className="text-4xl font-extrabold tracking-tight pb-12 flex justify-center">
        <span className="text-orange-500">Nexus</span>
        <span>Hub</span>
      </h2>
      <div
        className="
          w-full
          sm:w-[480px]
          md:w-[520px]
          lg:w-[560px]
          p-8
          bg-customGray
          rounded
          flex
          flex-col
          gap-6
        "
      >
        {step === 1 && (
          <form
            onSubmit={handleSubmit((data) => {
              const isEmail = EMAIL_REGEX.test(data.identifier);
              const isPhone = PHONE_REGEX.test(data.identifier);

              if (!isEmail && !isPhone) {
                setError('identifier', {
                  message: 'Enter valid email or phone number',
                });
                return;
              }

              setStep(2);
            })}
            className="flex flex-col gap-6"
          >
            <h3 className="text-2xl font-semibold">Sign in</h3>

            <div className="flex flex-col gap-1">
              <label>Email or phone number</label>
              <input
                {...register('identifier', { required: true })}
                className="p-3 rounded"
                placeholder="Email or phone"
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <Button className="w-full bg-blue-600 p-3 rounded">Continue</Button>
          </form>
        )}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <h3 className="text-2xl font-semibold">Sign in</h3>

            <div className="flex flex-col gap-1">
              <label>Password</label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="p-3 rounded"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full bg-blue-600 p-3 rounded">Sign in</Button>
          </form>
        )}

        <p className="text-sm text-gray-400 text-center">
          New here?{' '}
          <a href="/register" className="underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
