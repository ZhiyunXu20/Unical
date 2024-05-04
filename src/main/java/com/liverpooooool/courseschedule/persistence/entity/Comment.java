package com.liverpooooool.courseschedule.persistence.entity;

import com.liverpooooool.courseschedule.persistence.entity.abstact.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.print.attribute.standard.OrientationRequested;

@Setter
@Getter
@Entity
@Table
@Accessors(chain = true)
public class Comment extends BaseEntity {
    private String courseId;
    private String content;
    private String userId;
    private String username;
    // 评论所属类型
    private String typeDic;
}
