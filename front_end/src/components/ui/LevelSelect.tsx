import { HiOutlineAcademicCap } from 'react-icons/hi';

const LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Mới bắt đầu học' },
  { value: 'elementary', label: 'Elementary', description: 'Biết cơ bản' },
  { value: 'intermediate', label: 'Intermediate', description: 'Giao tiếp được' },
  { value: 'advanced', label: 'Advanced', description: 'Thành thạo' },
  { value: 'proficient', label: 'Proficient', description: 'Chuyên nghiệp' },
] as const;

interface LevelSelectProps {
  value?: string;
  onChange: (level: string) => void;
  error?: string;
}

const LevelSelect = ({ value, onChange, error }: LevelSelectProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-2">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg text-left transition-all
              ${value === level.value
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${value === level.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              <HiOutlineAcademicCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${value === level.value ? 'text-primary-700' : 'text-gray-900'}`}>
                {level.label}
              </p>
              <p className="text-xs text-gray-500">{level.description}</p>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LevelSelect;
