package com.liverpooooool.courseschedule.config.security;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liverpooooool.courseschedule.persistence.entity.User;
import com.liverpooooool.courseschedule.persistence.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserDetailService implements UserDetailsService {

    @Resource
    private UserMapper userMapper;

    public User getByUsername(String username) {
        LambdaQueryWrapper<User> wp = new LambdaQueryWrapper<User>();
        wp.eq(User::getUsername, username);
        return userMapper.selectOne(wp);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = Optional.ofNullable(this.getByUsername(username))
                .orElseThrow(() -> new UsernameNotFoundException("username or password error"));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

}
