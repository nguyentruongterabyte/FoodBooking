package com.foodbooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	UserDetailsService userDetailsService() {
		var encoder = passwordEncoder();
		// Create Example Users
		var admin = User.withUsername("admin").password(encoder.encode("admin")).roles("ADMIN").build();
		var user = User.withUsername("user").password(encoder.encode("user")).roles("USER").build();

		return new InMemoryUserDetailsManager(admin, user);
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(auth -> auth
				// Public resources
				.requestMatchers(HttpMethod.POST, "/login.html").permitAll()
				.requestMatchers("/", "/admin/login", "/login.html", "/home", "/home.html", "/assets/images/**",
						"/assets/library/**", "/css/**", "/javascript/**")
				.permitAll()
				.requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/swagger-resources/**",
						"/webjars/**")
				.permitAll()

				// Restricted APIs
				.requestMatchers(HttpMethod.GET, "/admin/**").hasRole("ADMIN")
//				.requestMatchers(HttpMethod.POST, "/api/animals").hasRole("ADMIN")
//				.requestMatchers(HttpMethod.PUT, "/api/animals/**").hasRole("ADMIN")
//				.requestMatchers(HttpMethod.PUT, "/api/animals").hasRole("ADMIN")

				// Authenticated access to other API endpoints
//				.requestMatchers("/api/**").authenticated()

				// Everything else
				.anyRequest().permitAll())
				.formLogin(form -> form.loginPage("/login.html").loginProcessingUrl("/perform-login")
						.defaultSuccessUrl("/admin/dashboard", true).failureUrl("/login?error=true").permitAll())
				.logout(logout -> logout.logoutUrl("/logout").invalidateHttpSession(true).deleteCookies("JSESSIONID")
						.permitAll());

		return http.build();
	}

	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
