'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { notify } from '@/lib/sse';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+\d{1,3}\d{10}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

type RegisterForm = {
  firstName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  terms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const body = await res.json();

    if (!res.ok) {
      if (body.error === 'EMAIL_EXISTS') {
        setError('email', {
          message: 'Email already in use',
        });

        notify({
          type: 'error',
          message: 'Email already in use',
        });
      }

      if (body.error === 'PHONE_EXISTS') {
        setError('phone', {
          message: 'Phone number already in use',
        });

        notify({
          type: 'error',
          message: 'Phone number already in use',
        });
      }

      return;
    }

    router.push('/register/success');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-20 p-6 bg-customGray rounded flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold ">Create account</h2>
      {/* First Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName">Name</label>
        <input
          id="firstName"
          {...register('firstName', { required: 'Please enter your name' })}
          placeholder="Name"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register('email', {
            required: 'Please enter a valid email address.',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please enter a valid email address.',
            },
          })}
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          {...register('phone', {
            required: 'Please enter your phone number.',
            pattern: {
              value: PHONE_REGEX,
              message: 'Please enter your phone number.',
            },
          })}
          placeholder="Phone number (+48...)"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>
      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required:
              'Create a password which has at least 8 characters and includes at least 1 upper case letter. 1 lower case letter and 1 number.',
            pattern: {
              value: PASSWORD_REGEX,
              message:
                'Create a password which has at least 8 characters and includes at least 1 upper case letter. 1 lower case letter and 1 number.',
            },
          })}
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            validate: (val) =>
              val === watch('password') || 'Please enter confirm password',
          })}
          placeholder="Confirm password"
        />
        {errors.confirmPassword?.message && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <label htmlFor="country">Country / Region</label>
        <select
          id="country"
          {...register('country', { required: 'Country required' })}
        >
          <option value="">Select country</option>
          <option value="PL">Poland</option>
          <option value="DE">Germany</option>
          <option value="UK">United Kingdom</option>
          <option value="US">United States</option>
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>
      <label className="text-sm flex gap-2 items-center">
        <input
          type="checkbox"
          {...register('terms', {
            required: 'You must accept the terms',
          })}
        />
        By creating an account you agree to the Conditions of Use and Privacy
        Notice.
      </label>

      {errors.terms && (
        <p className="text-red-500 text-sm">{errors.terms.message}</p>
      )}
      <Button className="bg-blue-600  p-2 rounded">Register</Button>
    </form>
  );
}
