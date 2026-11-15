package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Fin du flux OAuth2 GitHub : on redirige vers le front avec un code à usage
 * unique, jamais avec le JWT lui-même.
 *
 * <p>Le front échange ensuite ce code via {@code POST /api/auth/oauth2/exchange}.</p>
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2CodeStore codeStore;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/oauth2/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomOAuth2User customOAuth2User)) {
            throw new IllegalStateException("Authenticated GitHub profile is missing");
        }
        User user = customOAuth2User.getUser();

        String code = codeStore.issue(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("code", code)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
