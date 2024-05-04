package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.User;
import com.liverpooooool.courseschedule.persistence.mapper.UserMapper;
import com.liverpooooool.courseschedule.service.UserService;
import com.liverpooooool.courseschedule.utils.QueryUtils;
import jakarta.annotation.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * <p>
 * 服务实现类
 * </p>
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    @Resource
    private UserMapper mapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(User entity) {
        entity.setId(null);
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(User entity) {
        return updateById(entity);
    }

    @Override
    public FlyPageInfo<User> page(FlyPageInfo<User> pageInfo, User user) {
        Page<User> page = QueryUtils.buildPage(pageInfo, User.class);
        QueryWrapper<User> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), User.class);
        Page<User> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        User model = new User();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    public User login(String username, String password) {

        return Optional.ofNullable(getByUsername(username)).filter(user -> user.getPassword().equals(password)).orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));
    }

    @Override
    public User getByUsername(String username) {
        LambdaQueryWrapper<User> wp = new LambdaQueryWrapper<User>();
        wp.eq(User::getUsername, username);
        return this.getOne(wp);
    }

    //    通过邮箱查询
    private User getByEmail(String email) {
        LambdaQueryWrapper<User> wp = new LambdaQueryWrapper<User>();
        wp.eq(User::getEmail, email);
        return this.getOne(wp);
    }

    @Resource
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User register(String username, String password, String email) {
        Optional.ofNullable(getByUsername(username)).ifPresent(user -> {
            throw new IllegalArgumentException("username is already registered");
        });
        Optional.ofNullable(getByEmail(email)).ifPresent(user -> {
            throw new IllegalArgumentException("email is already registered");
        });

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        save(user);
        return user;
    }
}
