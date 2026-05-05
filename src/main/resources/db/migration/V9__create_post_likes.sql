CREATE TABLE post_likes (
    post_id   BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);
