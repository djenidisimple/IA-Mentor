package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.service.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Récupère les infos de GitHub via l'appel API standard
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        // 2. Extrait les identifiants uniques pour la recherche
        String githubId = oAuth2User.getAttribute("id").toString();
        String email = oAuth2User.getAttribute("email");
        String login = oAuth2User.getAttribute("login");
        
        log.info("GitHub OAuth2 - User login: {}, email: {}", login, email);
        
        // 3. Cherche ou crée l'utilisateur en base
        User user = findOrCreateUser(oAuth2User, githubId, email);
        
        // 4. Retourne le OAuth2User enrichi avec l'utilisateur de notre base
        return new CustomOAuth2User(oAuth2User, user);
    }
    
    private User findOrCreateUser(OAuth2User oAuth2User, String githubId, String email) {
        String login = oAuth2User.getAttribute("login");
        
        // 1. Cherche par githubId d'abord
        Optional<User> userOpt = userRepository.findByGithubId(githubId);
        
        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            log.info("Utilisateur existant trouvé par githubId: {}", existingUser.getUsername());
            
            // Met à jour les infos qui ont pu changer sur GitHub
            updateUserFromGithub(existingUser, oAuth2User);
            
            return userRepository.save(existingUser);
        }
        
        // 2. Cherche par email (cas où l'utilisateur s'était inscrit par email classique)
        if (email != null && !email.isEmpty()) {
            userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isPresent()) {
                User existingUser = userOpt.get();
                log.info("Utilisateur existant trouvé par email: {}, liaison avec GitHub", existingUser.getUsername());
                
                // Lie le compte GitHub au compte existant
                existingUser.setGithubId(githubId);
                updateUserFromGithub(existingUser, oAuth2User);
                
                return userRepository.save(existingUser);
            }
        }
        
        // 3. Crée un nouvel utilisateur avec la méthode factory
        log.info("Création d'un nouvel utilisateur: {}", login);
        
        // Utilise la méthode statique de l'entité User (Single Source of Truth)
        User newUser = User.fromGithubOAuth2(oAuth2User);
        
        // Gère les conflits potentiels de username
        String uniqueUsername = generateUniqueUsername(newUser.getUsername());
        newUser.setUsername(uniqueUsername);
        
        return userRepository.save(newUser);
    }
    
    /**
     * Met à jour les champs de l'utilisateur qui peuvent changer sur GitHub
     */
    private void updateUserFromGithub(User user, OAuth2User oAuth2User) {
        String name = oAuth2User.getAttribute("name");
        String login = oAuth2User.getAttribute("login");
        String email = oAuth2User.getAttribute("email");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");
        
        // Met à jour le nom (utilise le login si le name est null)
        user.setName(name != null ? name : login);
        
        // Met à jour l'avatar
        user.setAvatarUrl(avatarUrl);
        
        // Met à jour l'email s'il a changé et n'est pas null
        if (email != null && !email.isEmpty()) {
            user.setEmail(email);
        }
    }
    
    /**
     * Génère un username unique en ajoutant un suffixe numérique si nécessaire
     */
    private String generateUniqueUsername(String baseUsername) {
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        if (!username.equals(baseUsername)) {
            log.info("Username {} déjà pris, utilisation de {}", baseUsername, username);
        }
        
        return username;
    }
}
