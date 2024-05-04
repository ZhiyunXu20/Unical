package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.CourseColor;

import java.util.HashMap;


/**
 * <p>
 * 服务类
 * </p>

 */
public interface CourseColorService extends IService<CourseColor> {
    boolean save(CourseColor entity);

    boolean edit(CourseColor entity);

    FlyPageInfo<CourseColor> page(FlyPageInfo<CourseColor> pageInfo, CourseColor entity);

    boolean switchStatus(String id, String status);

    void applyColor(HashMap<String, String> request);

    String getColorSettings(String userId);
}
