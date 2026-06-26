package com.personalmetrics.security;

import com.personalmetrics.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final JwtProperties properties;

  public JwtService(JwtProperties properties) {
    this.properties = properties;
  }

  public String generateToken(String subject) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + properties.expirationMs());
    return Jwts.builder()
        .subject(subject)
        .issuedAt(now)
        .expiration(exp)
        .signWith(signingKey())
        .compact();
  }

  public String extractSubject(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isTokenValid(String token, String expectedSubject) {
    try {
      Claims claims = parseClaims(token);
      return expectedSubject.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
    } catch (RuntimeException ex) {
      return false;
    }
  }

  private Claims parseClaims(String token) {
    return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
  }

  private SecretKey signingKey() {
    byte[] bytes = properties.secret().getBytes(StandardCharsets.UTF_8);
    if (bytes.length < 32) {
      throw new IllegalStateException("JWT secret must be at least 32 bytes");
    }
    return Keys.hmacShaKeyFor(bytes);
  }
}
