package com.liverpooooool.courseschedule.persistence.entity;

import com.liverpooooool.courseschedule.persistence.entity.abstact.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Setter
@Getter
@Entity
@Table
@Accessors(chain = true)
public class Course extends BaseEntity {
    private String courseMetaId;
    private String startTime;
    private String week;
    private String day;
    private String endTime;
}
