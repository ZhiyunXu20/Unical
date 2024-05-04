package com.liverpooooool.courseschedule.controller.rest;


import com.liverpooooool.courseschedule.controller.request.UserRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.User;
import com.liverpooooool.courseschedule.service.UserService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * <p>
 * 前端控制器
 * </p>
 */
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Resource
    private UserService service;

    @GetMapping("/page")
    public FlyResult page(FlyPageInfo<User> pageInfo, User entity) {
        return FlyResult.success(service.page(pageInfo, entity));
    }

    @GetMapping("/detail")
    public FlyResult detail(String id) {
        return FlyResult.success(service.getById(id));
    }

    @DeleteMapping("/remove")
    public FlyResult remove(String id) {
        return FlyResult.success(service.removeById(id));
    }

    @PutMapping("/update")
    public FlyResult updateById(@RequestBody @Valid User request) {
        service.updateById(request);
        return FlyResult.SUCCESS;
    }

    @PostMapping("/save")
    public FlyResult save(@RequestBody @Valid User request) {
        return FlyResult.success(service.save(request));
    }

    @DeleteMapping("/remove/batch")
    public FlyResult removeByIds(@RequestParam("ids") String[] ids) {
        service.removeByIds(Arrays.asList(ids));
        return FlyResult.SUCCESS;
    }

    @PutMapping("/switch/status")
    public FlyResult switchVisible(@RequestBody @Valid UserRequest.SwitchStatus request) {
        return FlyResult.success(service.switchStatus(request.getId(), request.getStatus()));
    }
}
