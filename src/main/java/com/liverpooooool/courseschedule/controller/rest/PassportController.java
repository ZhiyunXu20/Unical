package com.liverpooooool.courseschedule.controller.rest;

import cn.hutool.jwt.JWTUtil;
import com.liverpooooool.courseschedule.constant.FlyHttpStatus;
import com.liverpooooool.courseschedule.constant.SecurityConstant;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.User;
import com.liverpooooool.courseschedule.service.UserService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/v1/passport")
public class PassportController {
    @Resource
    private AuthenticationManager authenticationProvider;
    @Resource
    private UserService userService;

    @GetMapping("/login")
    public FlyResult login(String username, String password) {
        User user = null;
        try {
            authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            user = userService.getByUsername(username);
            // 创建jwt token
            HashMap<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getId());
            payload.put("username", user.getUsername());
            payload.put("email", user.getEmail());
            payload.put("semester", user.getSemester());
            payload.put("schoolYear", user.getSchoolYear());
            String token = JWTUtil.createToken(payload, SecurityConstant.JWT_SECRET.getBytes());
            user.setToken(token);
        } catch (Exception e) {
            if (e instanceof BadCredentialsException) {
                return FlyResult.of(FlyHttpStatus.FAIL, "username or password error");
            }
            log.info("login error:{}", e.getMessage());
            return FlyResult.of(FlyHttpStatus.FAIL, "login error");
        }
        return FlyResult.success(user);
    }

    @GetMapping("/register")
    public FlyResult register(String username, String password, String email) {
        User user = null;
        try {
            user = userService.register(username, password, email);
        } catch (Exception e) {
            log.info("register error:{}", e.getMessage());
            return FlyResult.of(FlyHttpStatus.FAIL, e.getMessage());
        }
        return FlyResult.success(user);
    }
}   
