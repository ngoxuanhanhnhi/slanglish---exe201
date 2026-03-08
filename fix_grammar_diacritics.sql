-- Fix grammar_levels descriptions
UPDATE grammar_levels SET description = 'Ngữ pháp tiếng Anh cơ bản dành cho người mới học', updated_at = NOW() WHERE "order" = 0;
UPDATE grammar_levels SET description = 'Ngữ pháp tiếng Anh nâng cao cho người học trung cấp trở lên', updated_at = NOW() WHERE "order" = 1;

-- Fix Basic level topics (order 0-9, level order = 0)
UPDATE grammar_topics SET name = 'Tenses (Các thì cơ bản)', description = 'Present Simple, Present Continuous, Past Simple, Present Perfect, Future', updated_at = NOW()
  WHERE "order" = 0 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Parts of Speech (Từ loại)', description = 'Noun, Verb, Adjective, Adverb, Preposition, Conjunction', updated_at = NOW()
  WHERE "order" = 1 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Sentence Structure (Cấu trúc câu)', description = 'Cách xây dựng câu đơn, câu ghép và câu phức hợp', updated_at = NOW()
  WHERE "order" = 2 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Subject – Verb Agreement (Chủ ngữ – động từ hòa hợp)', description = 'Quy tắc hòa hợp giữa chủ ngữ và động từ', updated_at = NOW()
  WHERE "order" = 3 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Modal Verbs (Động từ khuyết thiếu)', description = 'can, could, may, might, must, should, will, would, shall', updated_at = NOW()
  WHERE "order" = 4 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Conditionals (Câu điều kiện)', description = 'Type 0, Type 1, Type 2, Type 3', updated_at = NOW()
  WHERE "order" = 5 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Passive Voice (Câu bị động)', description = 'Cách chuyển câu chủ động sang câu bị động ở các thì', updated_at = NOW()
  WHERE "order" = 6 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Relative Clauses (Mệnh đề quan hệ)', description = 'who, which, that, whose, where, when', updated_at = NOW()
  WHERE "order" = 7 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Gerund & Infinitive (V-ing & To V)', description = 'Cách dùng động từ nguyên mẫu và danh động từ', updated_at = NOW()
  WHERE "order" = 8 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);
UPDATE grammar_topics SET name = 'Comparisons (So sánh)', description = 'So sánh hơn, so sánh nhất, so sánh bằng', updated_at = NOW()
  WHERE "order" = 9 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 0);

-- Fix Harder level topics (order 0-9, level order = 1)
UPDATE grammar_topics SET name = 'Noun Clauses (Mệnh đề danh ngữ)', description = 'Sử dụng mệnh đề danh ngữ làm chủ ngữ, tân ngữ, hoặc bổ ngữ', updated_at = NOW()
  WHERE "order" = 0 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Inversion (Đảo ngữ)', description = 'Câu đảo ngữ sau phó từ phủ định và các biểu đạt điều kiện', updated_at = NOW()
  WHERE "order" = 1 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Mixed Conditionals (Câu điều kiện hỗn hợp)', description = 'Kết hợp Type 2 và Type 3 để diễn đạt ý nghĩa phức tạp', updated_at = NOW()
  WHERE "order" = 2 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Cleft Sentences (Câu chẻ)', description = 'It is...that, What...is để nhấn mạnh', updated_at = NOW()
  WHERE "order" = 3 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Participle Clauses (Mệnh đề rút gọn)', description = 'Rút gọn mệnh đề bằng V-ing, V-ed, Having + V3', updated_at = NOW()
  WHERE "order" = 4 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Hedging Language (Giảm mức độ khẳng định)', description = 'seem, appear, tend, might, possibly để biểu đạt sự không chắc chắn', updated_at = NOW()
  WHERE "order" = 5 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Nominalisation (Danh hoá)', description = 'Chuyển động từ và tính từ thành danh từ trong văn bản học thuật', updated_at = NOW()
  WHERE "order" = 6 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Complex Relative Clauses', description = 'Mệnh đề quan hệ không xác định, rút gọn, và prep + whom/which', updated_at = NOW()
  WHERE "order" = 7 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Advanced Modal Structures', description = 'Modal perfect: must have, could have, should have, might have', updated_at = NOW()
  WHERE "order" = 8 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
UPDATE grammar_topics SET name = 'Subjunctive (Giả định thức)', description = 'Sử dụng giả định thức trong đề nghị, yêu cầu, và biểu đạt mong muốn', updated_at = NOW()
  WHERE "order" = 9 AND level_id = (SELECT id FROM grammar_levels WHERE "order" = 1);
