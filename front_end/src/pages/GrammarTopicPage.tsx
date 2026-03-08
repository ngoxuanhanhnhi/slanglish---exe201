import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  HiOutlineChevronLeft,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineExclamationCircle,
  HiOutlineBookOpen,
} from 'react-icons/hi';
import { getGrammarTopic } from '../services/vocabulary.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../features/auth/AuthContext';
import { useAppStore } from '../stores/appStore';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

const stripTimestampPrefix = (filename: string) => filename.replace(/^\d+-/, '');

const GrammarTopicPage = () => {
  const { isAdmin } = useAuth();
  const {
    selectedGrammarTopic,
    grammarTopicDetail,
    grammarLoading,
    grammarError,
    setGrammarTopicDetail,
    setGrammarLoading,
    setGrammarError,
    goBack
  } = useAppStore();

  useEffect(() => {
    if (!selectedGrammarTopic?.id) return;

    setGrammarLoading(true);
    getGrammarTopic(selectedGrammarTopic.id)
      .then(setGrammarTopicDetail)
      .catch(() => setGrammarError('Không tải được nội dung chủ điểm. Vui lòng thử lại.'))
      .finally(() => setGrammarLoading(false));
  }, [selectedGrammarTopic, setGrammarTopicDetail, setGrammarLoading, setGrammarError]);

  if (grammarLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (grammarError || !grammarTopicDetail) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <HiOutlineExclamationCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-500">{grammarError || 'Không tìm thấy chủ điểm ngữ pháp.'}</p>
        <button
          onClick={() => goBack()}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          ← Quay lại
        </button>
      </div>
    );
  }

  const hasFile = !!grammarTopicDetail.content?.startsWith('/uploads/grammar/');
  const hasHtml = !!grammarTopicDetail.content_html;
  const fileUrl = hasFile ? `${API_BASE}${grammarTopicDetail.content}` : null;
  const storedFileName = hasFile ? grammarTopicDetail.content!.split('/').pop()! : null;
  const displayFileName = storedFileName ? stripTimestampPrefix(storedFileName) : null;

  const safeHtml = hasHtml
    ? DOMPurify.sanitize(grammarTopicDetail.content_html!, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['src', 'alt', 'width', 'height', 'style'],
    })
    : '';

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      {/* Breadcrumb bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
          <button
            onClick={() => goBack()}
            className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors font-medium">
            <HiOutlineChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">Ngữ pháp</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 truncate max-w-[120px]">{grammarTopicDetail.level.name}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[220px]">{grammarTopicDetail.name}</span>
        </div>
      </div>

      {/* Topic header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            <HiOutlineBookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">
              {grammarTopicDetail.level.name}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mt-1.5">{grammarTopicDetail.name}</h1>
            {grammarTopicDetail.description && (
              <p className="text-sm text-gray-500 mt-1">{grammarTopicDetail.description}</p>
            )}
          </div>
          {isAdmin && hasFile && displayFileName && (
            <a
              href={fileUrl!}
              download={displayFileName}
              className="flex items-center gap-1.5 flex-shrink-0 text-xs text-gray-500 hover:text-primary-600 font-medium px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
              <HiOutlineDownload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline truncate max-w-[160px]">{displayFileName}</span>
              <span className="sm:hidden">Tải về</span>
            </a>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {hasHtml && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="grammar-content px-6 sm:px-10 py-8"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          )}

          {!hasHtml && hasFile && (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white border border-gray-200">
              <HiOutlineDocumentText className="w-12 h-12 text-gray-300 mb-3" />
              {isAdmin ? (
                <>
                  <p className="text-gray-500 font-medium">Nội dung chưa được chuyển đổi</p>
                  <p className="text-xs text-gray-400 mt-1 mb-6 text-center max-w-xs">
                    Vui lòng xoá file và upload lại để hệ thống tự động chuyển đổi nội dung.
                  </p>
                  <a
                    href={fileUrl!}
                    download={displayFileName ?? undefined}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm">
                    <HiOutlineDownload className="w-4 h-4" />
                    Tải xuống file gốc
                  </a>
                </>
              ) : (
                <>
                  <p className="text-gray-400 font-medium">Nội dung đang được cập nhật</p>
                  <p className="text-xs text-gray-300 mt-1">Vui lòng quay lại sau</p>
                </>
              )}
            </div>
          )}

          {!hasFile && !hasHtml && (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-white border-2 border-dashed border-gray-200">
              <HiOutlineDocumentText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">Chưa có tài liệu cho chủ điểm này</p>
              <p className="text-xs text-gray-300 mt-1">Admin sẽ bổ sung sớm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarTopicPage;