CREATE TABLE ai_request_history (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    prompt     TEXT      NOT NULL,
    response   TEXT      NOT NULL,
    cached     BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_history_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_ai_history_user_id    ON ai_request_history (user_id);
CREATE INDEX idx_ai_history_created_at ON ai_request_history (created_at);
