package com.example.authbackend.service;

import com.example.authbackend.dto.AuthResponse;
import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.dto.UserDTO;
import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public abstract class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Método auxiliar para convertir Entidad -> DTO
    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getName(),
                user.getAvatar(),
                user.isAdmin()
        );
    }


    public AuthResponse register(RegisterRequest request) {
        // Generate username from email if not provided
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = request.getEmail().split("@")[0];
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(username);
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getEmail());

        // Devolvemos el DTO
        return new AuthResponse(mapToDTO(savedUser), token, "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        // Devolvemos el DTO
        return new AuthResponse(mapToDTO(user), token, "Login successful");
    }
}
