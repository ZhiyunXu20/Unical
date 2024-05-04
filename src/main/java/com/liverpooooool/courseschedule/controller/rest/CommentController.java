package com.liverpooooool.courseschedule.controller.rest;

import com.liverpooooool.courseschedule.config.security.MyContextHolder;
import com.liverpooooool.courseschedule.controller.request.CommentRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.Comment;
import com.liverpooooool.courseschedule.service.CommentService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.jdbc.support.incrementer.MySQLIdentityColumnMaxValueIncrementer;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 */
@RestController
@RequestMapping("/api/v1/comment")
public class CommentController {
    @Resource
    private CommentService service;

    @GetMapping("/page")
    public FlyResult page(FlyPageInfo<Comment> pageInfo, Comment entity) {
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
    public FlyResult updateById(@RequestBody @Valid Comment request) {
        service.updateById(request);
        return FlyResult.SUCCESS;
    }
    @GetMapping("/query")
    public FlyResult query(String content) {
        return FlyResult.success(service.query(content));
    }
    
    @GetMapping("/myComments")
    public FlyResult getMyComments() {
        return FlyResult.success(service.getMyComments(MyContextHolder.getUserId()));
    }

    @PostMapping("/save")
    public FlyResult save(@RequestBody @Valid Comment request) {
        return FlyResult.success(service.save(request));
    }

    @DeleteMapping("/remove/batch")
    public FlyResult removeByIds(@RequestParam("ids") String[] ids) {
        service.removeByIds(Arrays.asList(ids));
        return FlyResult.SUCCESS;
    }

    @PutMapping("/switch/status")
    public FlyResult switchVisible(@RequestBody @Valid CommentRequest.SwitchStatus request) {
        return FlyResult.success(service.switchStatus(request.getId(), request.getStatus()));
    }
}
