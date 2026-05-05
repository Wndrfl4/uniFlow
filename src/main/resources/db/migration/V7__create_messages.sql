CREATE TABLE messages
(
    id          BIGSERIAL PRIMARY KEY,
    sender_id   BIGINT       NOT NULL REFERENCES users (id),
    receiver_id BIGINT       NOT NULL REFERENCES users (id),
    content     TEXT,
    type        VARCHAR(20)  NOT NULL DEFAULT 'TEXT',
    file_url    VARCHAR(500),
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages (sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_receiver_unread ON messages (receiver_id, is_read) WHERE is_read = FALSE;
