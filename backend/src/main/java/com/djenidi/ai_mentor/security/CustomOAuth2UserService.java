package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.Role;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // Extraction des infos de GitHub
        String githubId = oauth2User.getAttribute("id").toString();
        String username = oauth2User.getAttribute("login");
        String email = oauth2User.getAttribute("email");
        String avatarUrl = oauth2User.getAttribute("avatar_url");

        // Si l'email est null (souvent le cas avec GitHub), utiliser le login
        if (email == null) {
            email = username + "@github.com";
        }

        // Recherche ou création de l'utilisateur
        updateOrCreateUser(githubId, username, email, avatarUrl);

        return oauth2User;
    }

    private void updateOrCreateUser(String githubId, String username, String email, String avatarUrl) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setGithubId(githubId);
            user.setAvatarUrl(avatarUrl);
        } else {
            user = User.builder()
                    .githubId(githubId)
                    .username(username)
                    .email(email)
                    .avatarUrl(avatarUrl)
                    .password("") // Pas de mot de passe pour OAuth2
                    .role(Role.USER)
                    .points(0)
                    .isPremium(false)
                    .build();
        }
        userRepository.save(user);
    }
}
