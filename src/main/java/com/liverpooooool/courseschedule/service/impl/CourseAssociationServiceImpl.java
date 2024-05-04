package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.CourseAssociation;
import com.liverpooooool.courseschedule.persistence.mapper.CourseAssociationMapper;
import com.liverpooooool.courseschedule.service.CourseAssociationService;
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
public class CourseAssociationServiceImpl extends ServiceImpl<CourseAssociationMapper, CourseAssociation> implements CourseAssociationService {
    @Resource
    private CourseAssociationMapper mapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(CourseAssociation entity) {
        entity.setId(null);
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(CourseAssociation entity) {
        return updateById(entity);
    }

    @Override
    public FlyPageInfo<CourseAssociation> page(FlyPageInfo<CourseAssociation> pageInfo, CourseAssociation user) {
        Page<CourseAssociation> page = QueryUtils.buildPage(pageInfo, CourseAssociation.class);
        QueryWrapper<CourseAssociation> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), CourseAssociation.class);
        Page<CourseAssociation> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        CourseAssociation model = new CourseAssociation();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    public boolean resetCourse(String userId) {
        LambdaQueryWrapper<CourseAssociation> wp = new LambdaQueryWrapper<>();
        wp.eq(CourseAssociation::getUserId, userId);
        this.mapper.delete(wp);
        return true;
    }
}
