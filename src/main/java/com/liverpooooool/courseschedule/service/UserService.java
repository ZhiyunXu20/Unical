package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.User;


/**
 * <p>
 * 服务类
 * </p>
 *
 */
public interface UserService extends IService<User> {
    boolean save(User entity);

    boolean edit(User entity);

    FlyPageInfo<User> page(FlyPageInfo<User> pageInfo, User entity);

    boolean switchStatus(String id, String status);

    User login(String username, String password);

    User getByUsername(String username);

    User register(String username, String password, String email);
}
