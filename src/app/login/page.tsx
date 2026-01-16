'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { notify } from '@/lib/sse';

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

  // STEP 2 – REAL LOGIN
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
    <div className="p-20">
      <h2 className="text-4xl font-extrabold tracking-tight pb-8 flex justify-center">
        <span className="text-orange-500">Nexus</span>
        <span className="text-white">Hub</span>
      </h2>
      <div className="max-w-md mx-auto p-6 bg-customGray rounded flex flex-col gap-4">
        {/* STEP 1 */}
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
            className="flex flex-col gap-5"
          >
            <h3 className="text-2xl">Sign in</h3>

            <div className="flex flex-col gap-1">
              <label>Email or phone number</label>
              <input
                {...register('identifier', { required: true })}
                className="p-2 rounded"
                placeholder="Email or phone"
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <Button className="mt-4 w-full bg-blue-600 p-2 rounded">
              Continue
            </Button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <h3>Sign in</h3>

            <div className="flex flex-col gap-1">
              <label>Password</label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="p-2 rounded"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="mt-4 w-full bg-blue-600 p-2 rounded">
              Sign in
            </Button>
          </form>
        )}

        <p className="text-sm text-gray-400 mt-4">
          New here? <a href="/register">Create account</a>
        </p>
      </div>
    </div>
  );
}
