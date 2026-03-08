import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../features/auth/AuthContext';
import { userService } from '../services/user.service';
import { Button, Input, CountrySelect, LevelSelect } from '../components/ui';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePencil,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCamera,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import { useAppStore } from '../stores/appStore';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  elementary: 'Elementary',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  proficient: 'Proficient',
};

const profileSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const {
    profileIsEditing: isEditingProfile, profileIsUpdating: isUpdatingProfile,
    profileIsPasswordOpen: isPasswordOpen, profileIsChangingPassword: isChangingPassword,
    profileShowCurrentPassword: showCurrentPassword, profileShowNewPassword: showNewPassword,
    profileSelectedCountry: selectedCountry, profileSelectedLevel: selectedLevel,
    profileAvatarPreview: avatarPreview, profileAvatarFile: avatarFile,
    profileIsUploadingAvatar: isUploadingAvatar,
    setProfileIsEditing: setIsEditingProfile, setProfileIsUpdating: setIsUpdatingProfile,
    setProfileIsPasswordOpen: setIsPasswordOpen, setProfileIsChangingPassword: setIsChangingPassword,
    setProfileShowCurrentPassword: setShowCurrentPassword, setProfileShowNewPassword: setShowNewPassword,
    setProfileSelectedCountry: setSelectedCountry, setProfileSelectedLevel: setSelectedLevel,
    setProfileAvatarPreview: setAvatarPreview, setProfileAvatarFile: setAvatarFile,
    setProfileIsUploadingAvatar: setIsUploadingAvatar
  } = useAppStore();

  useEffect(() => {
    if (user) {
      if (!selectedCountry) setSelectedCountry(user.country || '');
      if (!selectedLevel) setSelectedLevel(user.english_level || '');
    }
  }, [user, selectedCountry, selectedLevel, setSelectedCountry, setSelectedLevel]);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // ─── Profile Submit ──────────────────────────────────────────────
  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      const response = await userService.updateProfile({
        ...data,
        country: selectedCountry || null,
        english_level: selectedLevel || null,
      });
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Cập nhật thành công!');
        setIsEditingProfile(false);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    resetProfileForm({ name: user?.name || '' });
    setSelectedCountry(user?.country || '');
    setSelectedLevel(user?.english_level || '');
    setIsEditingProfile(false);
  };

  // ─── Password Submit ─────────────────────────────────────────────
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      resetPasswordForm();
      setIsPasswordOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ─── Avatar Upload ───────────────────────────────────────────────
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh phải nhỏ hơn 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarConfirm = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const response = await userService.uploadAvatar(avatarFile);
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Cập nhật ảnh đại diện thành công!');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Cập nhật ảnh thất bại');
    } finally {
      setIsUploadingAvatar(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  };

  const handleAvatarCancel = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) {
      if (user.avatar.startsWith('http')) return user.avatar;
      return `${API_BASE}${user.avatar}`;
    }
    return null;
  };

  // Mock stats
  const userStats = {
    lessonsCompleted: 12,
    quizzesTaken: 8,
    studyTime: '24 giờ',
    streak: 5,
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>

      {/* ── Profile Header Card ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary-500 to-primary-600" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative group shrink-0 -mt-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-700">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Camera overlay on hover */}
              {!avatarPreview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <HiOutlineCamera className="w-6 h-6 text-white" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            {/* Name & Email */}
            <div className="pb-1 flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{user?.name}</h2>
              <p className="text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Avatar confirmation bar */}
          {avatarPreview && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex-1">Xác nhận đổi ảnh đại diện?</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAvatarCancel}
                disabled={isUploadingAvatar}
              >
                <HiOutlineX className="w-4 h-4 mr-1" />
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleAvatarConfirm}
                isLoading={isUploadingAvatar}
              >
                <HiOutlineCheck className="w-4 h-4 mr-1" />
                Xác nhận
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <HiOutlineAcademicCap className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userStats.lessonsCompleted}</p>
          <p className="text-sm text-gray-500">Bài học hoàn thành</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
            <HiOutlineChartBar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userStats.quizzesTaken}</p>
          <p className="text-sm text-gray-500">Bài kiểm tra</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
            <HiOutlineClock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userStats.studyTime}</p>
          <p className="text-sm text-gray-500">Thời gian học</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
            <span className="text-orange-600 font-bold">🔥</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{userStats.streak} ngày</p>
          <p className="text-sm text-gray-500">Chuỗi học liên tiếp</p>
        </div>
      </div>

      {/* ── Profile Info + Security ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <HiOutlineUser className="w-5 h-5 mr-2 text-primary-600" />
              Thông tin cá nhân
            </h3>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <HiOutlinePencil className="w-4 h-4" />
                Thay đổi
              </button>
            )}
          </div>

          <div className="p-5">
            {isEditingProfile ? (
              /* ── Edit Mode ── */
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Nhập họ và tên"
                      className="pl-10"
                      error={profileErrors.name?.message}
                      {...registerProfile('name')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      value={user?.email || ''}
                      className="pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Quốc gia</label>
                  <CountrySelect
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trình độ tiếng Anh</label>
                  <LevelSelect
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isUpdatingProfile}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            ) : (
              /* ── Read-Only Mode ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Họ và tên</span>
                  <span className="text-sm font-medium text-gray-900">{user?.name || '—'}</span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user?.email || '—'}</span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <HiOutlineGlobeAlt className="w-4 h-4" />
                    Quốc gia
                  </span>
                  <span className="text-sm font-medium text-gray-900">{user?.country || '—'}</span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <HiOutlineAcademicCap className="w-4 h-4" />
                    Trình độ
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.english_level ? LEVEL_LABELS[user.english_level] || user.english_level : '—'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-xl border border-gray-200 h-fit">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <HiOutlineShieldCheck className="w-5 h-5 mr-2 text-primary-600" />
              Bảo mật
            </h3>
          </div>

          <div className="p-5">
            {isPasswordOpen ? (
              /* ── Password Form ── */
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="pl-10 pr-10"
                      error={passwordErrors.currentPassword?.message}
                      {...registerPassword('currentPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu mới"
                      className="pl-10 pr-10"
                      error={passwordErrors.newPassword?.message}
                      {...registerPassword('newPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-10"
                      error={passwordErrors.confirmPassword?.message}
                      {...registerPassword('confirmPassword')}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      resetPasswordForm();
                      setIsPasswordOpen(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isChangingPassword}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    Lưu mật khẩu
                  </Button>
                </div>
              </form>
            ) : (
              /* ── Default: Description + Button ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Mật khẩu</span>
                  <span className="text-sm text-gray-900">••••••••</span>
                </div>
                <p className="text-xs text-gray-500">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsPasswordOpen(true)}
                >
                  <HiOutlineLockClosed className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
