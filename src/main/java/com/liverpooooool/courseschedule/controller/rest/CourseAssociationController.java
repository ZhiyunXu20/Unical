package com.liverpooooool.courseschedule.controller.rest;


import com.liverpooooool.courseschedule.controller.request.CourseAssociationRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.CourseAssociation;
import com.liverpooooool.courseschedule.service.CourseAssociationService;
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
@RequestMapping("/api/v1/courseAssociation")
public class CourseAssociationController {
    @Resource
    private CourseAssociationService service;

    @GetMapping("/page")
    public FlyResult page(FlyPageInfo<CourseAssociation> pageInfo, CourseAssociation entity) {
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
    public FlyResult updateById(@RequestBody @Valid CourseAssociation request) {
        service.updateById(request);
        return FlyResult.SUCCESS;
    }

    @PostMapping("/save")
    public FlyResult save(@RequestBody @Valid CourseAssociation request) {
        return FlyResult.success(service.save(request));
    }

    @DeleteMapping("/remove/batch")
    public FlyResult removeByIds(@RequestParam("ids") String[] ids) {
        service.removeByIds(Arrays.asList(ids));
        return FlyResult.SUCCESS;
    }

    @PutMapping("/switch/status")
    public FlyResult switchVisible(@RequestBody @Valid CourseAssociationRequest.SwitchStatus request) {
        return FlyResult.success(service.switchStatus(request.getId(), request.getStatus()));
    }
}
