package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.controller.request.CourseRequest;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.CourseMeta;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * <p>
 * 服务类
 * </p>

 */
public interface CourseMetaService extends IService<CourseMeta> {
    boolean save(CourseMeta entity);

    boolean edit(CourseMeta entity);

    FlyPageInfo<CourseMeta> page(FlyPageInfo<CourseMeta> pageInfo, CourseMeta entity);

    boolean switchStatus(String id, String status);

    boolean batchSave(List<CourseRequest.BatchAddEntity> request, String userId);
}
