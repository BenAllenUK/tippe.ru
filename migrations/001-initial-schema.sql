--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL
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

INSERT INTO User (id, name) VALUES (1, 'Ben Allen');
INSERT INTO User (id, name) VALUES (2, 'Nick Pearson');

INSERT INTO Post (id, userId, longitude, latitude, content, upVotes, downVotes) VALUES (1, 1, 0, 0, 'Hello world from Ben', 0, 0);
INSERT INTO Post (id, userId, longitude, latitude, content, upVotes, downVotes) VALUES (2, 2, 0, 0, 'Hello world from Nick', 0, 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Post_ix_userId;
DROP TABLE Post;
DROP TABLE User;