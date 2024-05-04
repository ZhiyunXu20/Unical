package com.liverpooooool.courseschedule.controller.rest;


import com.liverpooooool.courseschedule.config.security.MyContextHolder;
import com.liverpooooool.courseschedule.controller.request.CourseRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.object.dto.FlyResult;
import com.liverpooooool.courseschedule.persistence.entity.Course;
import com.liverpooooool.courseschedule.service.CourseAssociationService;
import com.liverpooooool.courseschedule.service.CourseColorService;
import com.liverpooooool.courseschedule.service.CourseMetaService;
import com.liverpooooool.courseschedule.service.CourseService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

/**
 * <p>
 * 前端控制器
 * </p>
 */
@RestController
@RequestMapping("/api/v1/course")
public class CourseController {
    @Resource
    private CourseService service;    @Resource
    private CourseMetaService metaService;
    @Resource
    private CourseAssociationService assService;

    @Resource
    private CourseColorService courseColorService;
    
    @GetMapping("/page")
    public FlyResult page(FlyPageInfo<Course> pageInfo, Course entity) {
        return FlyResult.success(service.page(pageInfo, entity));
    }
    @PostMapping("/batchAddCourseMeta")
    public FlyResult batchAddCourseMeta(@RequestBody List<CourseRequest.BatchAddEntity> request) {
        String userId = MyContextHolder.getUserId();
        new Thread(() -> metaService.batchSave(request,userId)).start();
        return FlyResult.SUCCESS;
    }
    @GetMapping("/detail")
    public FlyResult detail(String id) {
        return FlyResult.success(service.detail(id));
    }

    /**
     * 删除自己课表的课程
     * @param id
     * @return
     */
    @DeleteMapping("/remove")
    public FlyResult remove(String id) {
        return FlyResult.success(service.removeMyCourse(MyContextHolder.getUserId(),id));
    }

    @PutMapping("/update")
    public FlyResult updateById(@RequestBody @Valid Course request) {
        service.updateById(request);
        return FlyResult.SUCCESS;
    }

    @PostMapping("/save")
    public FlyResult save(@RequestBody @Valid Course request) {
        return FlyResult.success(service.save(request));
    }

    @DeleteMapping("/remove/batch")
    public FlyResult removeByIds(@RequestParam("ids") String[] ids) {
        service.removeByIds(Arrays.asList(ids));
        return FlyResult.SUCCESS;
    }

    @PostMapping("/color/save")
    public FlyResult saveColor(@RequestBody HashMap<String, String> request) {
        courseColorService.applyColor(request);
        return FlyResult.SUCCESS;
    }

    @GetMapping("/color")
    public FlyResult getColor() {
        return FlyResult.success(courseColorService.getColorSettings(MyContextHolder.getUserId()));
    }
    @DeleteMapping("/remove/all")
    public FlyResult removeAll() {
        return FlyResult.success(assService.resetCourse(MyContextHolder.getUserId()));
    }
    @PutMapping("/switch/status")
    public FlyResult switchVisible(@RequestBody @Valid CourseRequest.SwitchStatus request) {
        return FlyResult.success(service.switchStatus(request.getId(), request.getStatus()));
    }
    
    @GetMapping("/listAllInfo")
    public FlyResult listAll() {
        return FlyResult.success(service.listAllInfo());
    }
    
    // 查询我的课程
    @GetMapping("/myCourse")
    public FlyResult myCourse() {
        return FlyResult.success(service.myCourse(MyContextHolder.getUserId()));
    }
}
