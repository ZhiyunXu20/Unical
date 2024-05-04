package com.liverpooooool.courseschedule.object.dto;

import com.liverpooooool.courseschedule.persistence.entity.Comment;
import lombok.Data;

import java.util.List;

@Data
public class CourseDto {
    private String id;
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
    // 具体某节课的id
    private String courseId;
    private String start;
    private String end;
    private String startTime;
    private String endTime;
    private String week;
    
    private List<Comment> commentList;
}
