package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liverpooooool.courseschedule.config.security.MyContextHolder;
import com.liverpooooool.courseschedule.object.dto.CourseDto;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.Comment;
import com.liverpooooool.courseschedule.persistence.entity.Course;
import com.liverpooooool.courseschedule.persistence.entity.CourseAssociation;
import com.liverpooooool.courseschedule.persistence.mapper.CourseMapper;
import com.liverpooooool.courseschedule.service.CommentService;
import com.liverpooooool.courseschedule.service.CourseAssociationService;
import com.liverpooooool.courseschedule.service.CourseService;
import com.liverpooooool.courseschedule.utils.QueryUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 */
@Service
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course> implements CourseService {
    @Resource
    private CourseMapper mapper;
    @Resource
    private CourseAssociationService associationService;
    @Resource
    private CommentService commentService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(Course entity) {
        entity.setId(null);
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(Course entity) {
        return updateById(entity);
    }


    @Override
    public FlyPageInfo<Course> page(FlyPageInfo<Course> pageInfo, Course user) {
        Page<Course> page = QueryUtils.buildPage(pageInfo, Course.class);
        QueryWrapper<Course> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), Course.class);
        Page<Course> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        Course model = new Course();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    public List<CourseDto> myCourse(String userId) {
        return mapper.myCourse(userId);
    }

    @Override
    public boolean removeMyCourse(String userId, String id) {
        LambdaQueryWrapper<CourseAssociation> wp = new LambdaQueryWrapper<>();
        wp.eq(CourseAssociation::getCourseId, id)
                .eq(CourseAssociation::getUserId, userId);
        return this.associationService.remove(wp);
    }

    @Override
    public CourseDto detail(String id) {
        CourseDto detail = mapper.detail(id);
        LambdaQueryWrapper<Comment> wp = new LambdaQueryWrapper<>();
        wp.eq(Comment::getCourseId,id)
                        .orderByDesc(Comment::getCreateTime);
        detail.setCommentList(commentService.list(wp));
        return detail;
    }

    @Override
    public List<CourseDto> listAllInfo() {
        return  mapper.listAllInfo();
    }


}
