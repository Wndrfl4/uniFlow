package com.uniflow.blog.exception;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException(long secondsRemaining) {
        super("Account temporarily locked. Try again in " + secondsRemaining + " seconds.");
    }
}
