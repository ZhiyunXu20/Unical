package com.liverpooooool.courseschedule.controller.rest;


import com.liverpooooool.courseschedule.controller.request.CourseMetaRequest;
import com.liverpooooool.courseschedule.controller.request.CourseRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.CourseMeta;
import com.liverpooooool.courseschedule.service.CourseMetaService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * <p>
 * 前端控制器
 * </p>
 */
@RestController
@RequestMapping("/api/v1/courseMeta")
public class CourseMetaController {
    @Resource
    private CourseMetaService service;

    @GetMapping("/page")
    public FlyResult page(FlyPageInfo<CourseMeta> pageInfo, CourseMeta entity) {
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
    public FlyResult updateById(@RequestBody @Valid CourseMeta request) {
        service.updateById(request);
        return FlyResult.SUCCESS;
    }

    @PostMapping("/save")
    public FlyResult save(@RequestBody @Valid CourseMeta request) {
        return FlyResult.success(service.save(request));
    }

    @DeleteMapping("/remove/batch")
    public FlyResult removeByIds(@RequestParam("ids") String[] ids) {
        service.removeByIds(Arrays.asList(ids));
        return FlyResult.SUCCESS;
    }

    @PutMapping("/switch/status")
    public FlyResult switchVisible(@RequestBody @Valid CourseMetaRequest.SwitchStatus request) {
        return FlyResult.success(service.switchStatus(request.getId(), request.getStatus()));
    }
}
