package com.liverpooooool.courseschedule.object.dto;

import com.liverpooooool.courseschedule.constant.FlyHttpStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class FlyResult implements Serializable {
    private String code;
    private String msg;
    private Object data;


    // 静态全局变量不能设置
    public static FlyResult SUCCESS =
            of(FlyHttpStatus.SUCCESS);
    public static FlyResult FAIL =
            of(FlyHttpStatus.FAIL);

    public static FlyResult success(Object data) {
        return of(FlyHttpStatus.SUCCESS).setData(data);
    }

    public static FlyResult of(FlyHttpStatus status) {
        return new FlyResult()
                .setCode(status.getCode())
                .setMsg(status.getMsg())
                .setData(null);
    }

    public static FlyResult of(FlyHttpStatus status, String msg) {
        return new FlyResult()
                .setCode(status.getCode())
                .setMsg(msg)
                .setData(null);
    }

    public static FlyResult of(String code, String msg) {
        return new FlyResult()
                .setCode(code)
                .setMsg(msg)
                .setData(null);
    }
}
