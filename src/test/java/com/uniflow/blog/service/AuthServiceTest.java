package com.uniflow.blog.service;

import com.uniflow.blog.domain.RefreshToken;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.domain.enums.Role;
import com.uniflow.blog.dto.auth.AuthResponse;
import com.uniflow.blog.dto.auth.LoginRequest;
import com.uniflow.blog.dto.auth.RegisterRequest;
import com.uniflow.blog.dto.auth.TokenRefreshRequest;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.repository.RefreshTokenRepository;
import com.uniflow.blog.repository.UserRepository;
import com.uniflow.blog.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenDurationMs", 604800000L);
        testUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .password("encoded-password")
                .firstName("Ivan")
                .lastName("Petrov")
                .role(Role.STUDENT)
                .enabled(true)
                .build();
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setFirstName("Anna");
        request.setLastName("Ivanova");
        request.setRole(Role.STUDENT);

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn("access-token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        AuthResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_whenEmailAlreadyExists_shouldThrowConflict() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("student@test.com");
        request.setRole(Role.STUDENT);

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    void login_shouldAuthenticateAndReturnTokens() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn("access-token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        AuthResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getEmail()).isEqualTo("student@test.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_withWrongPassword_shouldThrowBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@test.com");
        request.setPassword("wrong");

        doThrow(BadCredentialsException.class).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void refreshToken_whenValid_shouldReturnNewAccessToken() {
        TokenRefreshRequest request = new TokenRefreshRequest();
        request.setRefreshToken("valid-refresh-token");

        RefreshToken refreshToken = RefreshToken.builder()
                .token("valid-refresh-token")
                .user(testUser)
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();

        when(refreshTokenRepository.findByToken(request.getRefreshToken())).thenReturn(Optional.of(refreshToken));
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn("new-access-token");

        AuthResponse response = authService.refreshToken(request);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isEqualTo("valid-refresh-token");
    }

    @Test
    void refreshToken_whenExpired_shouldDeleteAndThrow() {
        TokenRefreshRequest request = new TokenRefreshRequest();
        request.setRefreshToken("expired-token");

        RefreshToken refreshToken = RefreshToken.builder()
                .token("expired-token")
                .user(testUser)
                .expiryDate(Instant.now().minusSeconds(3600))
                .build();

        when(refreshTokenRepository.findByToken(request.getRefreshToken())).thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("expired");

        verify(refreshTokenRepository).delete(refreshToken);
    }

    @Test
    void refreshToken_whenNotFound_shouldThrowUnauthorized() {
        TokenRefreshRequest request = new TokenRefreshRequest();
        request.setRefreshToken("non-existent-token");

        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("not found");
    }
}
