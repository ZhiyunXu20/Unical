package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liverpooooool.courseschedule.controller.request.CourseRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.Course;
import com.liverpooooool.courseschedule.persistence.entity.CourseAssociation;
import com.liverpooooool.courseschedule.persistence.entity.CourseMeta;
import com.liverpooooool.courseschedule.persistence.mapper.CourseAssociationMapper;
import com.liverpooooool.courseschedule.persistence.mapper.CourseMapper;
import com.liverpooooool.courseschedule.persistence.mapper.CourseMetaMapper;
import com.liverpooooool.courseschedule.service.CourseAssociationService;
import com.liverpooooool.courseschedule.service.CourseMetaService;
import com.liverpooooool.courseschedule.utils.QueryUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 */
@Slf4j
@Service
public class CourseMetaServiceImpl extends ServiceImpl<CourseMetaMapper, CourseMeta> implements CourseMetaService {
    @Resource
    private CourseMetaMapper mapper;
    
    @Resource
    private CourseMapper courseMapper;
    
    @Resource
    private CourseAssociationService courseAssociationService;
    
    @Resource
    private CourseAssociationMapper courseAssociationMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(CourseMeta entity) {
        entity.setId(null);
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(CourseMeta entity) {
        return updateById(entity);
    }

    @Override
    public FlyPageInfo<CourseMeta> page(FlyPageInfo<CourseMeta> pageInfo, CourseMeta user) {
        Page<CourseMeta> page = QueryUtils.buildPage(pageInfo, CourseMeta.class);
        QueryWrapper<CourseMeta> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), CourseMeta.class);
        Page<CourseMeta> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        CourseMeta model = new CourseMeta();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    public boolean batchSave(List<CourseRequest.BatchAddEntity> request, String userId) {
        courseAssociationService.resetCourse(userId);
        // 补充不存在的课程信息 判断唯一表示通过 code 和type
        request.forEach(item -> {
            CourseMeta entity = new CourseMeta();
            entity
                    .setCode(item.getCode())
                    .setType(item.getType())
                    .setName(item.getName())
                    .setDay(item.getDay())
                    .setLocation(item.getLocation())
                    .setTeacher(item.getTeacher())
                    .setTimeStart(item.getTimeStart())
                    .setTimeEnd(item.getTimeEnd())
                    .setWeekInfo(item.getWeekInfo())
                    .setTableType(item.getTableType())
                    .setCourseWeekInfo(item.getCourseWeekInfo());
            // 不存在则插入
            QueryWrapper<CourseMeta> metaWp = new QueryWrapper<CourseMeta>()
                    .eq("code", item.getCode())
                    .eq("type", item.getType());
            if (mapper.selectCount(metaWp) == 0) {
                mapper.insert(entity);
            }
            CourseMeta courseMeta = mapper.selectOne(metaWp);
            // 判断时间是否存在不存在则插入
            if(courseMapper.selectCount(new QueryWrapper<Course>()
                    .eq("course_meta_id", entity.getId())
                    .eq("start_time", item.getStart())
                    .eq("end_time", item.getEnd())) == 0){
                Course course = new Course();
                course
                        .setCourseMetaId(courseMeta.getId())
                        .setStartTime(item.getStart())
                        .setWeek(item.getCourseWeekInfo())
                        .setDay(item.getDay())
                        .setWeek(item.getWeek())
                        .setEndTime(item.getEnd());
                courseMapper.insert(course);
                courseAssociationMapper.insert(new CourseAssociation()
                        .setCourseId(course.getId())
                        .setUserId(userId));
            }
        });
        return false;
    }
}
