package com.liverpooooool.courseschedule.persistence.entity;

import com.liverpooooool.courseschedule.persistence.entity.abstact.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 用户关联的课程，用户自己的课程表
 */
@Setter
@Getter
@Entity
@Table
@Accessors(chain = true)
public class CourseAssociation extends BaseEntity {
    private String courseId;
    private String userId;
}
