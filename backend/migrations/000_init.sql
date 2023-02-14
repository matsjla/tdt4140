CREATE TABLE IF NOT EXISTS users
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT                                 NOT NULL,
    password  TEXT                                 NOT NULL,
    email     TEXT UNIQUE                          NOT NULL,
    user_role TEXT CHECK (user_role IN ('u', 'a')) NOT NULL DEFAULT 'u'
);
