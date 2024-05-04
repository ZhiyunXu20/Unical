package com.liverpooooool.courseschedule.controller.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.print.PrinterAbortException;

@Data
public class CourseRequest {


    @Data
    public static class SaveOrUpdate {
        private String id;
    }
    @Data
    public static class SwitchStatus {
        @NotBlank
        private String id;
        @NotBlank
        private String status;
    }
    
    @Data
    public static class CourseColor {
        private String color;
        private String type;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BatchAddEntity {
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
        private String courseId;
        private String start;
        private String end;
        private String week;
    }
}
