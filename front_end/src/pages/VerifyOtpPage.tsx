import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../features/auth/AuthContext';
import { authService } from '../services/auth.service';
import AuthLayout from '../components/layouts/AuthLayout';
import { Button } from '../components/ui';
import { HiOutlineMailOpen, HiOutlineCheckCircle } from 'react-icons/hi';

const OTP_LENGTH = 6;

const VerifyOtpPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // If user is already verified, redirect
  useEffect(() => {
    if (user?.is_verified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (value && index === OTP_LENGTH - 1) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === OTP_LENGTH) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only accept 6-digit numeric paste
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setOtp(digits);

    // Focus last input
    inputRefs.current[OTP_LENGTH - 1]?.focus();

    // Auto-submit
    handleVerify(pastedData);
  };

  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== OTP_LENGTH) {
      toast.error('Vui lòng nhập đầy đủ mã OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({ otp: otpCode });
      if (response.success) {
        setIsVerified(true);
        // Update user in context
        if (user) {
          updateUser({ ...user, is_verified: true });
        }
        toast.success('Xác thực email thành công!');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Mã OTP không hợp lệ');
      // Clear OTP and refocus first input
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await authService.resendOtp();
      toast.success('Mã OTP mới đã được gửi đến email của bạn');
      setCountdown(60); // 60 second cooldown
      // Clear current OTP
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể gửi lại mã OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (isVerified) {
    return (
      <AuthLayout title="Xác thực thành công!" subtitle="Email của bạn đã được xác thực">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Tài khoản của bạn đã được xác thực thành công. 
            Bạn có thể bắt đầu sử dụng Slanglish ngay bây giờ!
          </p>

          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full" 
            size="lg"
          >
            Bắt đầu học ngay
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Xác thực email"
      subtitle={`Nhập mã OTP đã gửi đến ${user?.email || 'email của bạn'}`}
    >
      <div className="text-center">
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <HiOutlineMailOpen className="w-9 h-9 text-primary-600" />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Chúng tôi đã gửi một mã xác thực gồm 6 chữ số đến email{' '}
          <span className="font-semibold text-gray-700">{user?.email}</span>.
          Mã có hiệu lực trong 15 phút.
        </p>

        {/* OTP Input Grid */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                transition-all duration-200
                ${digit 
                  ? 'border-primary-400 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 bg-white text-gray-900'
                }
                ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              disabled={isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerify(otp.join(''))}
          className="w-full mb-4"
          size="lg"
          isLoading={isLoading}
          disabled={otp.join('').length !== OTP_LENGTH}
        >
          Xác thực
        </Button>

        {/* Resend OTP */}
        <div className="text-sm text-gray-500">
          Không nhận được mã?{' '}
          {countdown > 0 ? (
            <span className="text-gray-400">
              Gửi lại sau {countdown}s
            </span>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
            </button>
          )}
        </div>

        {/* Skip verification (optional) */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Bỏ qua, xác thực sau →
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
