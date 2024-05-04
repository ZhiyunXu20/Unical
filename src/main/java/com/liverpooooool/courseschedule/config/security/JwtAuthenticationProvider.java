package com.liverpooooool.courseschedule.config.security;


import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liverpooooool.courseschedule.constant.SecurityConstant;
import com.liverpooooool.courseschedule.persistence.entity.User;
import com.liverpooooool.courseschedule.persistence.mapper.UserMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtAuthenticationProvider {
    @Resource
    private UserMapper userMapper;

    public User getByUsername(String username) {
        LambdaQueryWrapper<User> wp = new LambdaQueryWrapper<User>();
        wp.eq(User::getUsername, username);
        return userMapper.selectOne(wp);
    }
    private final UserDetailsService detailService;

    public JwtAuthenticationProvider(UserDetailsService detailService) {
        this.detailService = detailService;
    }

    /**
     * 认证操作
     *
     * @param token
     * @param request
     * @throws AuthenticationException
     */
    public void authenticate(String token, HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (!checkToken(token)) {
            return;
        }

        JWT jwt = JWTUtil.parseToken(token);
        String username = String.valueOf(jwt.getPayload("username"));
        UsernamePasswordAuthenticationToken result = UsernamePasswordAuthenticationToken.authenticated(
                detailService.loadUserByUsername(username),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER")
                ));
        result.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
        result.setDetails(getByUsername(username));
        SecurityContext context = SecurityContextHolder.getContextHolderStrategy().createEmptyContext();
        context.setAuthentication(result);
        SecurityContextHolder.getContextHolderStrategy().setContext(context);
    }

    private boolean checkToken(String token) {
        return JWTUtil.verify(token, SecurityConstant.JWT_SECRET.getBytes());
    }
}
