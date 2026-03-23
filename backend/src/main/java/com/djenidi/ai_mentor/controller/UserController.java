package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.User;
import com.djenidi.ai_mentor.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Crée un nouvel utilisateur
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
    
    /**
     * Récupère tous les utilisateurs
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
     * Récupère un utilisateur par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Récupère un utilisateur par son username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Récupère un utilisateur par son email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Met à jour un utilisateur
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Met à jour le mot de passe d'un utilisateur
     */
    @PatchMapping("/{id}/password")
    public ResponseEntity<User> updatePassword(@PathVariable Long id,
                                               @RequestParam String oldPassword,
                                               @RequestParam String newPassword) {
        User updatedUser = userService.updatePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Supprime un utilisateur
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Récupère les utilisateurs par rôle
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    /**
     * Récupère tous les étudiants
     */
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    /**
     * Récupère tous les mentors
     */
    @GetMapping("/mentors")
    public ResponseEntity<List<User>> getAllMentors() {
        List<User> mentors = userService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }
    
    /**
     * Authentifie un utilisateur
     */
    @PostMapping("/authenticate")
    public ResponseEntity<User> authenticate(@RequestParam String usernameOrEmail,
                                             @RequestParam String password) {
        User user = userService.authenticate(usernameOrEmail, password);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Vérifie si un utilisateur existe
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = userService.existsById(id);
        return ResponseEntity.ok(exists);
    }
    
    /**
     * Compte le nombre d'utilisateurs
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long count = userService.countUsers();
        return ResponseEntity.ok(count);
    }
}