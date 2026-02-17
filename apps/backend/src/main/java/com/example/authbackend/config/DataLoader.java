package com.example.authbackend.config;

import com.example.authbackend.model.Professional;
import com.example.authbackend.model.User;
import com.example.authbackend.repository.ProfessionalRepository;
import com.example.authbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfessionalRepository professionalRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo si no hay usuarios, creamos los datos iniciales
        if (userRepository.count() == 0) {
            crearDatosIniciales();
        }
    }

    private void crearDatosIniciales() {
        System.out.println("🌱 SEMBRANDO USUARIOS ADMIN Y MÉDICOS...");

        // 1. CREAR ADMINISTRADOR (El "Jefe")
        // Este usuario tendrá permisos para crear otros médicos si tu seguridad lo requiere
        User admin = new User();
        admin.setEmail("admin@hospital.com");
        admin.setUsername("admin");
        admin.setName("Super Administrador");
        admin.setPassword(passwordEncoder.encode("admin123")); // En prod usar: encoder.encode("admin123")
        admin.setAdmin(true); // <--- LA CLAVE: Es administrador

        userRepository.save(admin);
        System.out.println("👑 ADMINISTRADOR CREADO: admin@hospital.com / admin123");

        // 2. CREAR UN USUARIO MÉDICO (Para pruebas rápidas)
        // Ojo: Esto crea un User normal.
        // Si tu lógica requiere que exista también en la tabla 'professionals',
        // necesitarías inyectar ProfessionalRepository y crearlo ahí también.

        User doctorUser = new User();
        doctorUser.setEmail("house@hospital.com");
        doctorUser.setUsername("house");
        doctorUser.setName("Dr. Gregory House");
        doctorUser.setPassword(passwordEncoder.encode("123456"));
        doctorUser.setAdmin(true);

        userRepository.save(doctorUser);
        System.out.println("👨‍⚕️ USUARIO MÉDICO CREADO: house@hospital.com / 123456");
    }
}
