import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/layouts/AuthLayout';
import { Button, Input } from '../components/ui';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const resetPasswordSchema = z
  .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Link đặt lại không hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      setIsSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Link không hợp lệ" subtitle="Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Link đặt lại mật khẩu bạn nhấp vào không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
          </p>
          <Link to="/forgot-password">
            <Button className="w-full">Yêu cầu link mới</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout title="Đặt lại thành công!" subtitle="Mật khẩu của bạn đã được đặt lại thành công">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
          </p>

          <Button onClick={() => navigate('/login')} className="w-full">
            Đăng nhập ngay
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Nhập mật khẩu mới của bạn">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label">Mật khẩu mới</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu mới"
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
              placeholder="Nhập lại mật khẩu mới"
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

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Đặt lại mật khẩu
        </Button>

        <p className="text-center text-gray-600 text-sm">
          Nhớ mật khẩu rồi?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
