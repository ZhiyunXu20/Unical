package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.CourseAssociation;


/**
 * <p>
 * 服务类
 * </p>

 */
public interface CourseAssociationService extends IService<CourseAssociation> {
    boolean save(CourseAssociation entity);

    boolean edit(CourseAssociation entity);

    FlyPageInfo<CourseAssociation> page(FlyPageInfo<CourseAssociation> pageInfo, CourseAssociation entity);

    boolean switchStatus(String id, String status);

    boolean resetCourse(String userId);
}
