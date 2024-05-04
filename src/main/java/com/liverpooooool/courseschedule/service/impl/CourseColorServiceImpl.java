package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liverpooooool.courseschedule.config.security.MyContextHolder;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.CourseColor;
import com.liverpooooool.courseschedule.persistence.mapper.CourseColorMapper;
import com.liverpooooool.courseschedule.service.CourseColorService;
import com.liverpooooool.courseschedule.utils.QueryUtils;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 */
@Service
public class CourseColorServiceImpl extends ServiceImpl<CourseColorMapper, CourseColor> implements CourseColorService {
    @Resource
    private CourseColorMapper mapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(CourseColor entity) {
        entity.setId(null);
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(CourseColor entity) {
        return updateById(entity);
    }

    @Override
    public FlyPageInfo<CourseColor> page(FlyPageInfo<CourseColor> pageInfo, CourseColor user) {
        Page<CourseColor> page = QueryUtils.buildPage(pageInfo, CourseColor.class);
        QueryWrapper<CourseColor> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), CourseColor.class);
        Page<CourseColor> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        CourseColor model = new CourseColor();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyColor(HashMap<String, String> request) {
        String userId = MyContextHolder.getUserId();
        // 删除之前所有的颜色配置
        LambdaQueryWrapper<CourseColor> query = new LambdaQueryWrapper<>();
        query.eq(CourseColor::getUserId, userId);
        remove(query);
        
        request.forEach((k, v) -> {
            CourseColor color = new CourseColor();
            color
                    .setUserId(userId)
                    .setType(k)
                    .setColor(v);
            save(color);
        });
    }

    @Override
    @SneakyThrows
    public String getColorSettings(String userId) {
        // 查询用户的颜色配置
        LambdaQueryWrapper<CourseColor> query = new LambdaQueryWrapper<>();
        query.eq(CourseColor::getUserId, userId);
        List<CourseColor> list = list(query);
        // 转map, key为type, value为color
        Map<String, String> colorMap = list.stream().collect(Collectors.toMap(CourseColor::getType, CourseColor::getColor));
        return new ObjectMapper().writeValueAsString(colorMap);
    }
}
