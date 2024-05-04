package com.liverpooooool.courseschedule.persistence.entity;


import com.liverpooooool.courseschedule.persistence.entity.abstact.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 课程元信息
 */
@Getter
@Setter
@Entity
@Table
@Accessors(chain = true)
public class CourseMeta extends BaseEntity {
    private String type;
    private String code;
    private String name;
    private String day;
    private String location;
    private String teacher;
    private String timeStart;
    private String timeEnd;
    // 课程周次信息
    private String weekInfo;
    // 自己的、公开、还是手动
    private String tableType;
    private String courseWeekInfo;
}
