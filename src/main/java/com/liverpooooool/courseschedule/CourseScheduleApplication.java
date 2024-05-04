package com.liverpooooool.courseschedule;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class CourseScheduleApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourseScheduleApplication.class, args);
        log.info("CourseScheduleApplication started successfully");
        // 打印knife4j文档地址
        log.info("Doc: http://localhost:8000/doc.html");
    }

}
