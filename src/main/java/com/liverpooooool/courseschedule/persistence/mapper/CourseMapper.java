package com.liverpooooool.courseschedule.persistence.mapper;

import com.liverpooooool.courseschedule.object.dto.CourseDto;
import com.liverpooooool.courseschedule.persistence.entity.Course;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 */
public interface CourseMapper extends BaseMapper<Course> {

    List<CourseDto> myCourse(String userId);

    CourseDto detail(String courseId);

    List<CourseDto> listAllInfo();
}
