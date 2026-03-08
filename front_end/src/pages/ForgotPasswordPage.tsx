import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/layouts/AuthLayout';
import { Button, Input } from '../components/ui';
import { useAppStore } from '../stores/appStore';
import {
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';

// --- (schemas same as before) ---
const emailSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .refine((email) => email.endsWith('@gmail.com'), {
      message: 'Chỉ chấp nhận email @gmail.com',
    }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 15 * 60; // 15 minutes

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const {
    authStep: step, authEmail: email, authResetToken: resetToken, authOtp: otp,
    authCountdown: countdown, authCanResend: canResend, authLoading: isLoading,
    setAuthStep: setStep, setAuthEmail: setEmail, setAuthResetToken: setResetToken,
    setAuthOtp: setOtp, setAuthCountdown: setCountdown, setAuthCanResend: setCanResend,
    setAuthLoading: setIsLoading
  } = useAppStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Email form ─────────────────────────────────────────────────
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // ── Password form ─────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // ── Countdown timer for OTP ────────────────────────────────────
  useEffect(() => {
    if (step !== 2) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown, setCountdown, setCanResend]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email: data.email });
      setEmail(data.email);
      setStep(2);
      setCountdown(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      toast.success('Mã OTP đã được gửi tới email của bạn');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      toast.success('Mã OTP mới đã được gửi');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gửi lại OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      toast.error('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyResetOtp({ email, otp: otpCode });
      if (response.success && response.data) {
        setResetToken(response.data.resetToken);
        setStep(3);
        toast.success('Xác minh OTP thành công!');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Mã OTP không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset password ────────────────────────────────────
  const onPasswordSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({ token: resetToken, password: data.password });
      setStep(4);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };


  // ═══════════════════════════════════════════════════════════════
  // STEP 4: Success
  // ═══════════════════════════════════════════════════════════════
  if (step === 4) {
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

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: New Password
  // ═══════════════════════════════════════════════════════════════
  if (step === 3) {
    return (
      <AuthLayout title="Đặt lại mật khẩu" subtitle="Nhập mật khẩu mới của bạn">
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
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
                error={passwordErrors.password?.message}
                {...registerPassword('password')}
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
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
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
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: Enter OTP
  // ═══════════════════════════════════════════════════════════════
  if (step === 2) {
    return (
      <AuthLayout title="Nhập mã OTP" subtitle={`Mã xác nhận đã được gửi tới ${email}`}>
        <div className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={index === 0 ? handleOtpPaste : undefined}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            ))}
          </div>

          {/* Countdown */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Mã hết hạn sau{' '}
                <span className="font-semibold text-primary-600">{formatCountdown(countdown)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">Mã OTP đã hết hạn</p>
            )}
          </div>

          {/* Verify button */}
          <Button
            type="button"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            onClick={handleVerifyOtp}
            disabled={otp.join('').length !== OTP_LENGTH || countdown <= 0}
          >
            Xác nhận OTP
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Không nhận được mã?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
                  disabled={isLoading}
                >
                  Gửi lại
                </button>
              ) : (
                <span className="text-gray-400">Gửi lại sau {formatCountdown(countdown)}</span>
              )}
            </p>
          </div>

          {/* Back to email */}
          <button
            type="button"
            onClick={() => { setStep(1); setOtp(Array(OTP_LENGTH).fill('')); }}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Đổi email khác
          </button>
        </div>
      </AuthLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: Enter Email
  // ═══════════════════════════════════════════════════════════════
  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập email để nhận mã OTP đặt lại mật khẩu"
    >
      <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineMail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="Nhập email @gmail.com của bạn"
              className="pl-10"
              error={emailErrors.email?.message}
              {...registerEmail('email')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Gửi mã OTP
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

export default ForgotPasswordPage;
