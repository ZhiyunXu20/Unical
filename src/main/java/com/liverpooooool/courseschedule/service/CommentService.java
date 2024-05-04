package com.liverpooooool.courseschedule.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.Comment;

import java.util.List;


/**
 * <p>
 * 服务类
 * </p>

 */
public interface CommentService extends IService<Comment> {
    boolean save(Comment entity);

    boolean edit(Comment entity);

    FlyPageInfo<Comment> page(FlyPageInfo<Comment> pageInfo, Comment entity);

    boolean switchStatus(String id, String status);
    
    // 获取我的评论
    List<Comment> getMyComments(String userId);

    List<Comment> query(String content);
}
