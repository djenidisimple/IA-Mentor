package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.entity.AuthSession;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.TokenException;
import com.djenidi.ai_mentor.repository.AuthSessionRepository;
import com.djenidi.ai_mentor.security.TokenHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private AuthSessionRepository sessionRepository;

    @InjectMocks
    private RefreshTokenService service;

    private User user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "refreshExpirationDays", 90L);
        ReflectionTestUtils.setField(service, "refreshGraceSeconds", 30L);
        ReflectionTestUtils.setField(service, "maxSessions", 10);
        user = User.builder().username("alice").email("alice@example.com").build();
        lenient().when(sessionRepository.save(any(AuthSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void rotationReturnsANewTokenAndKeepsThePreviousOneForTheGraceWindow() {
        String oldRawToken = "old-raw-token";
        AuthSession session = AuthSession.builder()
                .user(user)
                .tokenHash(TokenHasher.hash(oldRawToken))
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();

        when(sessionRepository.findByTokenHash(TokenHasher.hash(oldRawToken)))
                .thenReturn(Optional.of(session));

        RefreshTokenService.IssuedSession issued = service.validateAndRotate(oldRawToken);

        assertThat(issued.rawToken()).isNotEqualTo(oldRawToken);
        assertThat(session.getPreviousTokenHash()).isEqualTo(TokenHasher.hash(oldRawToken));
        assertThat(session.getPreviousTokenValidUntil()).isAfter(Instant.now());
        assertThat(session.getTokenHash()).isEqualTo(TokenHasher.hash(issued.rawToken()));
        assertThat(session.getExpiryDate()).isAfter(Instant.now());
        assertThat(session.getLastUsedAt()).isNotNull();
    }

    @Test
    void aConcurrentTabInsideTheGraceWindowIsTolerated() {
        String oldRawToken = "previous-token";
        AuthSession session = AuthSession.builder()
                .user(user)
                .tokenHash(TokenHasher.hash("current-token"))
                .previousTokenHash(TokenHasher.hash(oldRawToken))
                .previousTokenValidUntil(Instant.now().plusSeconds(20))
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();

        when(sessionRepository.findByTokenHash(TokenHasher.hash(oldRawToken))).thenReturn(Optional.empty());
        when(sessionRepository.findByPreviousTokenHash(TokenHasher.hash(oldRawToken)))
                .thenReturn(Optional.of(session));

        RefreshTokenService.IssuedSession issued = service.validateAndRotate(oldRawToken);

        assertThat(issued.rawToken()).isNotBlank();
        assertThat(session.getTokenHash()).isEqualTo(TokenHasher.hash(issued.rawToken()));
        verify(sessionRepository, never()).revokeAllByUser(any());
    }

    @Test
    void replayingAnOldTokenRevokesEverySession() {
        String oldRawToken = "replayed-token";
        AuthSession session = AuthSession.builder()
                .user(user)
                .tokenHash(TokenHasher.hash("current-token"))
                .previousTokenHash(TokenHasher.hash(oldRawToken))
                .previousTokenValidUntil(Instant.now().minusSeconds(5))
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();

        when(sessionRepository.findByTokenHash(TokenHasher.hash(oldRawToken))).thenReturn(Optional.empty());
        when(sessionRepository.findByPreviousTokenHash(TokenHasher.hash(oldRawToken)))
                .thenReturn(Optional.of(session));

        assertThatThrownBy(() -> service.validateAndRotate(oldRawToken))
                .isInstanceOf(TokenException.class)
                .hasMessageContaining("réutilisé");

        verify(sessionRepository).revokeAllByUser(user);
    }

    @Test
    void aRevokedSessionCannotBeRotated() {
        String rawToken = "revoked-token";
        AuthSession session = AuthSession.builder()
                .user(user)
                .tokenHash(TokenHasher.hash(rawToken))
                .expiryDate(Instant.now().plusSeconds(3600))
                .revoked(true)
                .build();

        when(sessionRepository.findByTokenHash(TokenHasher.hash(rawToken)))
                .thenReturn(Optional.of(session));

        assertThatThrownBy(() -> service.validateAndRotate(rawToken))
                .isInstanceOf(TokenException.class)
                .hasMessageContaining("révoqué");
    }

    @Test
    void aMissingCookieIsRejected() {
        assertThatThrownBy(() -> service.validateAndRotate(null))
                .isInstanceOf(TokenException.class)
                .hasMessageContaining("manquant");
        verifyNoInteractions(sessionRepository);
    }

    @Test
    void createSessionStoresOnlyTheHashOfTheToken() {
        AuthSessionRepository repository = sessionRepository;
        when(repository.findByUserAndRevokedFalseOrderByCreatedAtAsc(user)).thenReturn(java.util.List.of());

        RefreshTokenService.IssuedSession issued = service.createSession(user, "JUnit");

        ArgumentCaptor<AuthSession> captor = ArgumentCaptor.forClass(AuthSession.class);
        verify(repository).save(captor.capture());

        AuthSession persisted = captor.getValue();
        assertThat(persisted.getTokenHash()).isEqualTo(TokenHasher.hash(issued.rawToken()));
        assertThat(persisted.getTokenHash()).isNotEqualTo(issued.rawToken());
        assertThat(persisted.getUserAgent()).isEqualTo("JUnit");
        assertThat(persisted.getExpiryDate()).isAfter(Instant.now());
    }
}
