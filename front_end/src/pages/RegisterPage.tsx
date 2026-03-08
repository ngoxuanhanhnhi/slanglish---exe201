import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../features/auth/AuthContext';
import AuthLayout from '../components/layouts/AuthLayout';
import { Button, Input, CountrySelect, LevelSelect } from '../components/ui';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name, selectedCountry || undefined, selectedLevel || undefined);
      toast.success('Đăng ký thành công! Vui lòng xác thực email.');
      navigate('/verify-otp');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Không nhận được thông tin từ Google');
      return;
    }

    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Đăng ký với Google thành công!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Đăng ký với Google thất bại');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Đăng ký Google thất bại. Vui lòng thử lại.');
  };

  return (
    <AuthLayout 
      title="Đăng ký tài khoản" 
      subtitle="Bắt đầu hành trình học tiếng Anh cùng hàng triệu học viên"
    >
      {/* Google Sign Up */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>
        {isGoogleLoading && (
          <p className="text-center text-sm text-gray-500">Đang xử lý đăng ký Google...</p>
        )}
      </div>

      {/* Terms notice */}
      <p className="text-xs text-gray-500 text-center mb-4">
        Bằng cách đăng ký, bạn đồng ý với{' '}
        <Link to="/terms" className="text-primary-600 hover:underline">điều khoản sử dụng</Link>
        {' '}và{' '}
        <Link to="/privacy" className="text-primary-600 hover:underline">chính sách bảo mật</Link>
      </p>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">hoặc đăng ký với email</span>
        </div>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineUser className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Nhập họ và tên"
              className="pl-10"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineMail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="Nhập email"
              className="pl-10"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <div>
          <label className="label">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 8 ký tự, chữ hoa, số, ký tự đặc biệt"
              className="pl-10 pr-10"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="label">Xác nhận mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              className="pl-10 pr-10"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Country Select */}
        <div>
          <label className="label">Quốc gia</label>
          <CountrySelect
            value={selectedCountry}
            onChange={setSelectedCountry}
          />
        </div>

        {/* English Level Select */}
        <div>
          <label className="label">Trình độ tiếng Anh</label>
          <LevelSelect
            value={selectedLevel}
            onChange={setSelectedLevel}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Đăng ký
        </Button>
      </form>

      <p className="text-center text-gray-600 mt-6 text-sm">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold">
          Đăng nhập ngay!
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
