package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        log.debug("Tentative de connexion avec: {}", login);
        
        // Cherche par email
        Optional<User> userOpt = userRepository.findByEmail(login);
        if (userOpt.isPresent()) {
            log.debug("Trouvé par email: {}", login);
            return userOpt.get();
        }
        
        // Cherche par username
        userOpt = userRepository.findByUsername(login);
        if (userOpt.isPresent()) {
            log.debug("Trouvé par username: {}", login);
            return userOpt.get();
        }
        
        // Cherche par githubId (si l'utilisateur utilise son login GitHub)
        userOpt = userRepository.findByGithubId(login);
        if (userOpt.isPresent()) {
            log.debug("Trouvé par githubId: {}", login);
            return userOpt.get();
        }
        
        log.warn("Aucun utilisateur trouvé pour: {}", login);
        throw new UsernameNotFoundException("Utilisateur non trouvé avec : " + login);
    }
}
