--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  email TEXT NOT NULL,
  googleUserID TEXT,
  password TEXT,
  salt TEXT
);

CREATE TABLE Post (
  id          INTEGER PRIMARY KEY,
  userId      INTEGER NOT NULL,
  longitude   FLOAT NOT NULL,
  latitude    FLOAT NOT NULL,
  content     TEXT NOT NULL,
  upVotes     INTEGER NOT NULL DEFAULT 0,
  downVotes   INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT Post_fk_userId FOREIGN KEY (userId)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX Post_ix_userId ON Post (userId);

INSERT INTO User (id, name, email, googleUserID, password, salt) VALUES (1, 'BenAllen', 'ben@example.com', '', 'd69202dab7983f73db4bd15e2fc10cb0b0683d573651c5b0753eef04613a4de9', 'e5614448');
INSERT INTO User (id, name, email, googleUserID, password, salt) VALUES (2, 'NickPearson', 'nick@example.com', '', '099c63bace046d961b6f51ffe5e8c6e53a25ee46764a1574612ad677031eef8b', '71918438');

INSERT INTO Post (id, userId, longitude, latitude, content, upVotes, downVotes) VALUES (1, 1, 0, 0, 'Hello world from Ben', 0, 0);
INSERT INTO Post (id, userId, longitude, latitude, content, upVotes, downVotes) VALUES (2, 2, 0, 0, 'Hello world from Nick', 0, 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Post_ix_userId;
DROP TABLE Post;
DROP TABLE User;
