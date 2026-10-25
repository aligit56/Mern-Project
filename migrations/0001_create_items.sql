CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 2000),
  price REAL NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT '' CHECK (length(category) <= 80),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS items_created_at_idx ON items (created_at DESC);
