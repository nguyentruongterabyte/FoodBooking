package com.foodbooking.config;

import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.foodbooking.service.CustomUserDetailService;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Autowired
	private CustomUserDetailService customUserDetailService;

	/*
	 * @Bean UserDetailsService userDetailsService() { var encoder =
	 * passwordEncoder(); // Create Example Users var admin =
	 * User.withUsername("admin").password(encoder.encode("admin")).roles("ADMIN").
	 * build(); return new InMemoryUserDetailsManager(admin); }
	 */

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(auth -> auth
				// Public resources
				.requestMatchers(HttpMethod.POST, "/login.html").permitAll()
				.requestMatchers("/", "/delivery", "/admin/login", "/login.html", "/home", "/home.html",
						"/assets/images/**", "/assets/library/**", "/css/**", "/javascript/**", "/api/files/**")
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
						.defaultSuccessUrl("/admin/dashboard", true).failureHandler(failureHandler()).permitAll())
				.userDetailsService(customUserDetailService).logout(logout -> logout.logoutUrl("/logout")
						.invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll());

		return http.build();
	}

	@Bean
	AuthenticationFailureHandler failureHandler() {
		return (request, response, exception) -> {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			String message = exception instanceof BadCredentialsException ? "Your password or account is incorrectly"
					: "The system is under maintenance. Please try again later";
			response.getWriter().write("{\"error\": \"" + message + "\"}");
		};
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new Md5PasswordEncoder();
	}

	public static class Md5PasswordEncoder implements PasswordEncoder {

		@Override
		public String encode(CharSequence rawPassword) {
			try {
				MessageDigest md = MessageDigest.getInstance("MD5");
				byte[] digest = md.digest(rawPassword.toString().getBytes());
				StringBuilder sb = new StringBuilder();
				for (byte b : digest) {
					sb.append(String.format("%02x", b));
				}
				System.out.println(sb.toString());
				return sb.toString();
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}

		@Override
		public boolean matches(CharSequence rawPassword, String encodedPassword) {
			return encode(rawPassword).equals(encodedPassword);
		}

	}
}
