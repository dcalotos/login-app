-- Email Verification Tokens Table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_expiry ON email_verification_tokens(expiry_date);

-- Comments
COMMENT ON TABLE email_verification_tokens IS 'Stores email verification tokens for users';
COMMENT ON COLUMN email_verification_tokens.token IS 'UUID token sent to user email';
COMMENT ON COLUMN email_verification_tokens.expiry_date IS 'Token expiration timestamp (typically 24 hours)';
COMMENT ON COLUMN email_verification_tokens.used IS 'Whether the token has been used';
