-- 英语单词本
SET NAMES UTF8;
DROP DATABASE IF EXISTS en;
CREATE DATABASE en CHARSET = UTF8;
USE en;

CREATE TABLE en_word (
    id INT PRIMARY KEY AUTO_INCREMENT,
    en VARCHAR(100),
    ch VARCHAR(200)
);

-- INSERT INTO en_word VALUES(NULL,"book","书");
-- INSERT INTO en_word VALUES(NULL,"eye","眼睛");