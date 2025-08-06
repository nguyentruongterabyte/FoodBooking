package com.foodbooking.filter;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String idToken = getBearerToken(request);
		
		if (idToken != null) {
			try {
				FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
				
				String uid = decodedToken.getUid();
				
				request.setAttribute("firebaseUid", uid);
				
			} catch (FirebaseAuthException e) {
				response.setStatus(HttpStatus.UNAUTHORIZED.value());
				return;
			}
		}
		
		filterChain.doFilter(request, response);
	}

	private String getBearerToken(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			return authHeader.substring(7);
		}
		
		return null;
	}
}
