CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_posts_status_date ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id, status);

INSERT OR IGNORE INTO categories(id, name, sort_order) VALUES
  ('year', '신년운세', 1), ('month', '월간운세', 2), ('today', '오늘의 운세', 3),
  ('meeting', '만남', 4), ('crush', '짝사랑', 5), ('compatibility', '궁합', 6),
  ('worry', '연애고민', 7), ('saju', '사주 이야기', 8);
