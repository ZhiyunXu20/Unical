package com.liverpooooool.courseschedule.config.security;

import com.liverpooooool.courseschedule.persistence.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

/**

 */
public class MyContextHolder {
    
    private static final ThreadLocal<User> contextHolder = new ThreadLocal<>();

    
    public static String getUsername() {
        User details = (User) SecurityContextHolder.getContext().getAuthentication().getDetails();
        return details.getUsername();
    }
    
    public static User getContext() {
        User details = (User) SecurityContextHolder.getContext().getAuthentication().getDetails();
        return details;
    }
    
    public static String getUserId() {
        User details = (User) SecurityContextHolder.getContext().getAuthentication().getDetails();
        return details.getId();
    }

}
