package com.liverpooooool.courseschedule.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liverpooooool.courseschedule.config.security.MyContextHolder;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import com.liverpooooool.courseschedule.persistence.entity.Comment;
import com.liverpooooool.courseschedule.persistence.mapper.CommentMapper;
import com.liverpooooool.courseschedule.service.CommentService;
import com.liverpooooool.courseschedule.utils.QueryUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>

 */
@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {
    @Resource
    private CommentMapper mapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean save(Comment entity) {
        entity.setId(null);
        entity.setUserId(MyContextHolder.getUserId());
        entity.setUsername(MyContextHolder.getUsername());
        return super.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean edit(Comment entity) {
        return updateById(entity);
    }

    @Override
    public FlyPageInfo<Comment> page(FlyPageInfo<Comment> pageInfo, Comment user) {
        Page<Comment> page = QueryUtils.buildPage(pageInfo, Comment.class);
        QueryWrapper<Comment> wp = QueryUtils.buildQueryWrapper(user, List.of("createTime"), Comment.class);
        Page<Comment> data = page(page, wp);
        wp.orderByDesc("update_time");
        return FlyPageInfo.of(data);
    }


    @Override
    public boolean switchStatus(String id, String status) {
        Comment model = new Comment();
        model
                //.setStatus(status)
                .setId(id);
        return this.updateById(model);
    }

    @Override
    public List<Comment> getMyComments(String userId) {
        QueryWrapper<Comment> wp = new QueryWrapper<>();
        wp.eq("user_id", userId)
                .eq("type_dic", '0');
        return list(wp);
    }

    @Override
    public List<Comment> query(String content) {
        LambdaQueryWrapper<Comment> wp = new LambdaQueryWrapper<>();
        
        wp.like(Comment::getContent, content);
        return list(wp);
    }
}
