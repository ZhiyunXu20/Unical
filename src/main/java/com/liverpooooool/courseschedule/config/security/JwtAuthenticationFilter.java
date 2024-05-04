package com.liverpooooool.courseschedule.config.security;

import cn.hutool.core.util.StrUtil;
import com.liverpooooool.courseschedule.constant.FlyHttpStatus;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.utils.WebUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtAuthenticationProvider authenticationProvider;
    private final String loginPath = "/api/v1/passport/login";

    public JwtAuthenticationFilter(JwtAuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = request.getHeader("Authorization");
        if (!request.getRequestURI().endsWith(loginPath) && StrUtil.isNotBlank(token)) {
            try {
                authenticationProvider.authenticate(token, request, response);
            } catch (Exception e) {
                WebUtils.responseJson(response, FlyResult.of(FlyHttpStatus.FORBIDDEN, "Unauthorized"));
                return;
            }
        }
        filterChain.doFilter(request, response);
    }


}
