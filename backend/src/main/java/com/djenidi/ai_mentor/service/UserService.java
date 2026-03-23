package com.djenidi.ai_mentor.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.User;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubmissionRepository submissionRepository;  // Pour vérifier les soumissions
    
    // Constantes pour les rôles
    public static final String ROLE_STUDENT = "STUDENT";
    public static final String ROLE_MENTOR = "MENTOR";
    public static final String ROLE_ADMIN = "ADMIN";
    
    public UserService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder,
                       SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.submissionRepository = submissionRepository;
    }
    
    /**
     * Crée un nouvel utilisateur
     */
    public User createUser(User user) {
        // Validation des données
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        
        // Vérifier l'unicité du username
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + user.getUsername());
        }
        
        // Vérifier l'unicité de l'email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Définir un rôle par défaut si non spécifié
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole(ROLE_STUDENT);
        } else {
            // Normaliser le rôle en majuscules
            user.setRole(user.getRole().toUpperCase());
            
            // Valider le rôle
            if (!isValidRole(user.getRole())) {
                throw new RuntimeException("Invalid role. Allowed roles: STUDENT, MENTOR, ADMIN");
            }
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Récupère tous les utilisateurs
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Récupère un utilisateur par son ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    /**
     * Récupère un utilisateur par son username
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
    
    /**
     * Récupère un utilisateur par son email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    /**
     * Met à jour un utilisateur
     */
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        // Mise à jour conditionnelle du username
        if (userDetails.getUsername() != null && !userDetails.getUsername().trim().isEmpty()) {
            // Vérifier si le nouveau username est déjà pris par un autre utilisateur
            if (!user.getUsername().equals(userDetails.getUsername())) {
                if (userRepository.findByUsername(userDetails.getUsername()).isPresent()) {
                    throw new RuntimeException("Username already exists: " + userDetails.getUsername());
                }
                user.setUsername(userDetails.getUsername());
            }
        }
        
        // Mise à jour conditionnelle de l'email
        if (userDetails.getEmail() != null && !userDetails.getEmail().trim().isEmpty()) {
            // Vérifier si le nouvel email est déjà pris par un autre utilisateur
            if (!user.getEmail().equals(userDetails.getEmail())) {
                if (userRepository.findByEmail(userDetails.getEmail()).isPresent()) {
                    throw new RuntimeException("Email already exists: " + userDetails.getEmail());
                }
                user.setEmail(userDetails.getEmail());
            }
        }
        
        // Mise à jour conditionnelle du rôle
        if (userDetails.getRole() != null && !userDetails.getRole().trim().isEmpty()) {
            String normalizedRole = userDetails.getRole().toUpperCase();
            if (!isValidRole(normalizedRole)) {
                throw new RuntimeException("Invalid role. Allowed roles: STUDENT, MENTOR, ADMIN");
            }
            user.setRole(normalizedRole);
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Met à jour le mot de passe d'un utilisateur
     */
    public User updatePassword(Long id, String oldPassword, String newPassword) {
        User user = getUserById(id);
        
        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        
        // Valider le nouveau mot de passe
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password cannot be empty");
        }
        
        if (newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }
        
        // Encoder et définir le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        
        return userRepository.save(user);
    }
    
    /**
     * Supprime un utilisateur
     */
    public void deleteUser(Long id) {
        User user = getUserById(id);
        
        // Vérifier si l'utilisateur a des soumissions
        long submissionCount = submissionRepository.countByUserId(id);
        if (submissionCount > 0) {
            throw new RuntimeException("Cannot delete user with existing submissions. User has " + 
                                     submissionCount + " submission(s)");
        }
        
        userRepository.deleteById(id);
    }
    
    /**
     * Vérifie si un utilisateur existe
     */
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }
    
    /**
     * Compte le nombre d'utilisateurs
     */
    public long countUsers() {
        return userRepository.count();
    }
    
    /**
     * Récupère les utilisateurs par rôle
     */
    public List<User> getUsersByRole(String role) {
        String normalizedRole = role.toUpperCase();
        if (!isValidRole(normalizedRole)) {
            throw new RuntimeException("Invalid role. Allowed roles: STUDENT, MENTOR, ADMIN");
        }
        return userRepository.findByRole(normalizedRole);
    }
    
    /**
     * Récupère tous les étudiants
     */
    public List<User> getAllStudents() {
        return userRepository.findByRole(ROLE_STUDENT);
    }
    
    /**
     * Récupère tous les mentors
     */
    public List<User> getAllMentors() {
        return userRepository.findByRole(ROLE_MENTOR);
    }
    
    /**
     * Valide si un rôle est autorisé
     */
    private boolean isValidRole(String role) {
        return role.equals(ROLE_STUDENT) || 
               role.equals(ROLE_MENTOR) || 
               role.equals(ROLE_ADMIN);
    }
    
    /**
     * Authentifie un utilisateur
     */
    public User authenticate(String usernameOrEmail, String password) {
        User user = null;
        
        // Essayer de trouver par username d'abord
        if (userRepository.findByUsername(usernameOrEmail).isPresent()) {
            user = userRepository.findByUsername(usernameOrEmail).get();
        }
        // Sinon essayer par email
        else if (userRepository.findByEmail(usernameOrEmail).isPresent()) {
            user = userRepository.findByEmail(usernameOrEmail).get();
        }
        else {
            throw new RuntimeException("User not found with username or email: " + usernameOrEmail);
        }
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        return user;
    }
}