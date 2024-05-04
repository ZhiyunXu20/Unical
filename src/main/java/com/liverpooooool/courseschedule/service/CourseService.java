package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.object.dto.CourseDto;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.Course;

import java.util.List;


/**
 * <p>
 * 服务类
 * </p>

 */
public interface CourseService extends IService<Course> {
    boolean save(Course entity);

    boolean edit(Course entity);

    FlyPageInfo<Course> page(FlyPageInfo<Course> pageInfo, Course entity);

    boolean switchStatus(String id, String status);

    List<CourseDto> myCourse(String userId);

    boolean removeMyCourse(String userId, String id);

    CourseDto detail(String id);

    List<CourseDto> listAllInfo();
}
