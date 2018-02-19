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
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  upVotes     INTEGER NOT NULL DEFAULT 0,
  downVotes   INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT Post_fk_userId FOREIGN KEY (userId)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX Post_ix_userId ON Post (userId);

INSERT INTO User (id, name, email, googleUserID, password, salt) VALUES (1, 'BenAllen', 'ben@example.com', '', 'd69202dab7983f73db4bd15e2fc10cb0b0683d573651c5b0753eef04613a4de9', 'e5614448');
INSERT INTO User (id, name, email, googleUserID, password, salt) VALUES (2, 'NickPearson', 'nick@example.com', '', '099c63bace046d961b6f51ffe5e8c6e53a25ee46764a1574612ad677031eef8b', '71918438');

INSERT INTO Post (id, userId, longitude, latitude, title, content, upVotes, downVotes) VALUES (1, 1, 0, 0, 'Latest iPhone is..', 'Apple may not have announced the lates iPhone but words is that’s it got 3 cameras and 2 screens. It even has a special horn on it that makes people move out the way when you  are in busy crowds.', 0, 0);
INSERT INTO Post (id, userId, longitude, latitude, title, content, upVotes, downVotes) VALUES (2, 2, 0, 0, 'Get free food', 'Subway have just announced that for every 10 dominios vouchers you burn you get 1 free 6 foot subway! Make sure to film yourself doing it to use as proof when you had to the shop. ', 0, 0);
INSERT INTO Post (id, userId, longitude, latitude, title, content, upVotes, downVotes) VALUES (3, 2, 0, 0, 'Apple is actually based in India', 'The so-called california company has been found to contract all there jobs out to India. Programmers are reported to be turning up to work just to play Ping-Pong while their indian counter parts perform the work. The real Steve Ive is actually Hukbar Punar from central India.', 0, 0);
INSERT INTO Post (id, userId, longitude, latitude, title, content, upVotes, downVotes) VALUES (4, 2, 0, 0, 'London Stock Exchange replaced by dogs', 'Since computers now control the stock market, the london stock market has been replaced by servers with dogs guarding them from competition. The only purposes now of the bankers is to feed the dogs.', 0, 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Post_ix_userId;
DROP TABLE Post;
DROP TABLE User;
