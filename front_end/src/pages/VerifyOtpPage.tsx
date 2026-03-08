import React, { useEffect, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAppStore, VIEW_STATES } from '../stores/appStore';

const VerifyOtpPage = () => {
  const {
    authEmail,
    authOtp,
    authCountdown,
    authCanResend,
    authLoading,
    setAuthOtp,
    setAuthEmail,
    setAuthResetToken,
    setAuthCountdown,
    setAuthCanResend,
    setAuthLoading,
    setView,
    goBack
  } = useAppStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!authEmail) {
      setView(VIEW_STATES.LOGIN);
    }
  }, [authEmail, setView]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authCountdown > 0) {
      timer = setInterval(() => {
        setAuthCountdown(authCountdown - 1);
      }, 1000);
    } else {
      setAuthCanResend(true);
    }
    return () => clearInterval(timer);
  }, [authCountdown, setAuthCountdown, setAuthCanResend]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...authOtp];
    newOtp[index] = value.slice(-1);
    setAuthOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !authOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!authCanResend) return;

    try {
      setAuthLoading(true);
      await authService.forgotPassword(authEmail);
      setAuthCountdown(15 * 60);
      setAuthCanResend(false);
      setAuthOtp(Array(6).fill(''));
      toast.success('Mã xác thực mới đã được gửi');
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gửi lại mã');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = authOtp.join('');
    if (otpString.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ mã xác thực');
      return;
    }

    try {
      setAuthLoading(true);
      const response = await authService.verifyOtp({
        email: authEmail,
        otp: otpString
      });

      setAuthResetToken(response.data.resetToken);
      toast.success('Xác thực thành công');
      setView(VIEW_STATES.RESET_PASSWORD);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Mã xác thực không chính xác');
    } finally {
      setAuthLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => goBack()}
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
        >
          <HiOutlineArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
              <HiOutlineShieldCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Xác thực OTP</h2>
            <p className="mt-2 text-sm text-gray-600">
              Vui lòng nhập mã xác thực đã được gửi đến
              <span className="block font-medium text-gray-900 mt-1">{authEmail}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2 sm:gap-4">
              {authOtp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={authLoading}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none disabled:opacity-50"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={authLoading || authOtp.some(d => !d)}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {authLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </div>
              ) : (
                'Xác nhận'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400">Không nhận được mã?</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                {authCanResend ? (
                  <span className="text-green-600">Bạn có thể gửi lại mã ngay bây giờ</span>
                ) : (
                  <span>Gửi lại mã sau: <span className="text-primary-600 font-bold">{formatTime(authCountdown)}</span></span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResend}
                disabled={!authCanResend || authLoading}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <HiOutlineRefresh className={`w-4 h-4 ${authLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                Gửi lại mã xác thực
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Hãy kiểm tra cả hòm thư rác nếu bạn không thấy email trong hộp thư đến.
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
