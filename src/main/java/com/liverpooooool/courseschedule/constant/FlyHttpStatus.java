package com.liverpooooool.courseschedule.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FlyHttpStatus {
    SUCCESS("200", "操作成功", "通用成功"),
    FAIL("500", "系统繁忙，请稍后再试", "通用失败"),
    Internal_ERROR("501", "内部系统错误，请联系管理员", "系统内部错误"),
    BAD_REQUEST("400", "请求参数校验失败", "参数校验失败"),
    UNAUTHORIZED("401", "请先认证", "未登录操作"),
    TOKEN_INVALID("402", "登录过期,请重新登录", "令牌过期"),
    MALICIOUS("405", "请求无法找到", "恶意请求，锁定用户"),
    NOT_FOUND("404", "未找到", "没找到数据"),
    FORBIDDEN("403", "无权访问", "没有操作权限"),
    TOO_MANY_REQUESTS("429", "请求过于频繁，请稍后再试", "请求太快了");

    private final String code;
    private final String msg;
    private final String desc;
}
