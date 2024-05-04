package com.liverpooooool.courseschedule.utils;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.liverpooooool.courseschedule.object.dto.FlyPageInfo;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

@Slf4j
public class QueryUtils {
    public static <T> Page<T> buildPage(int pageNumber, int pageSize, Class<T> clazz) {
        return new Page<>(pageNumber, pageSize);
    }

    public static <T> Page<T> buildPage(FlyPageInfo<T> pageInfo, Class<T> clazz) {
        return new Page<>(pageInfo.getPageIndex(), pageInfo.getPageSize());
    }

    public static <T> QueryWrapper<T> buildQueryWrapper(T entity, List<String> queryColList, Class<T> clazz) {
        return buildQueryWrapper(entity, queryColList, clazz, clazz);
    }

    /**
     * 构建查询修改工具
     *
     * @param entity        查询修改实体
     * @param queryColList  查询列
     * @param updateColList 修改列
     * @param clazz         输入类
     * @param <T>           输入类泛型
     * @return 查询wrapper
     */
    public static <T> UpdateWrapper<T> buildUpdateWrapper(T entity, List<String> queryColList, List<String> updateColList, Class<T> clazz) {
        return buildUpdateWrapper(entity, queryColList, updateColList, clazz, clazz);
    }

    private static <T, Q> UpdateWrapper<T> buildUpdateWrapper(T entity, List<String> queryColList, List<String> updateColList, Class<T> clazz, Class<Q> clazzQ) {
        UpdateWrapper<T> wrapper = new UpdateWrapper<>();
        for (String col : queryColList) {
            Field field;
            field = recursionField(clazz, col);
            if (field == null) {
                log.info("查询字段在实体类没有找到,colum:{}", col);
                continue;
            }

            Method method = null;
            try {
                String methodName = "get" + StrUtil.upperFirst(field.getName());
                method = clazzQ.getMethod(methodName);
            } catch (NoSuchMethodException e) {
                log.info("查询字段在实体类没有找到方法,colum:{}", col);
                continue;
            }

            Object value;
            try {
                value = method.invoke(entity);
            } catch (InvocationTargetException | IllegalAccessException e) {
                log.info("查询字段在GET方法执行失败,colum:{}", col);
                continue;
            }
            if (value == null) {
                continue;
            }
            String colQuery = StrUtil.toUnderlineCase(col);
            if (value instanceof String valQuery) {
                if (StrUtil.isBlank(valQuery) || valQuery.isEmpty()) {
                    continue;
                }
                conditionWrapper(valQuery, wrapper, colQuery);
            } else {
                wrapper.eq(colQuery, value);
            }
        }

        for (String col : updateColList) {
            Field field;
            field = recursionField(clazz, col);
            if (field == null) {
                log.info("修改字段在实体类没有找到,colum:{}", col);
                continue;
            }

            Method method = null;
            try {
                String methodName = "get" + StrUtil.upperFirst(field.getName());
                method = clazzQ.getMethod(methodName);
            } catch (NoSuchMethodException e) {
                log.info("修改字段在实体类没有找到方法,colum:{}", col);
                continue;
            }

            Object value;
            try {
                value = method.invoke(entity);
            } catch (InvocationTargetException | IllegalAccessException e) {
                log.info("修改字段在GET方法执行失败,colum:{}", col);
                continue;
            }
            if (value == null) {
                continue;
            }
            String colQuery = StrUtil.toUnderlineCase(col);
            wrapper.set(colQuery, value);
        }
        return wrapper;
    }

    private static <T> void conditionWrapper(String valQuery, UpdateWrapper<T> wrapper, String colQuery) {
        if (valQuery.charAt(0) == ':') {
            wrapper.like(colQuery, StrUtil.subAfter(valQuery, ":", false));
        } else if (valQuery.contains(",")) {
            List<String> existInList = Arrays.asList(valQuery.split(","));
            wrapper.in(colQuery, existInList);
        } else if (valQuery.contains("~")) {
            List<String> betweenList = Arrays.asList(valQuery.split("~"));
            wrapper.between(colQuery, betweenList.get(0), betweenList.get(1));
        } else {
            wrapper.eq(colQuery, valQuery);
        }
    }


    /**
     * 构建模糊查询工具
     *
     * @param entity       单表查询实体
     * @param queryColList 查询列
     * @param clazz        输入类
     * @param clazzQ       返回类
     * @param <T>          输入类泛型
     * @param <Q>          返回类泛型
     * @return 查询wrapper
     */
    private static <T, Q> QueryWrapper<T> buildQueryWrapper(T entity, List<String> queryColList, Class<T> clazz, Class<Q> clazzQ) {
        QueryWrapper<T> wrapper = new QueryWrapper<>();
        if (entity == null) {
            return wrapper;
        }
        for (String col : queryColList) {
            Field field;
            field = recursionField(clazz, col);
            if (field == null) {
                log.info("查询字段在实体类没有找到,colum:{}", col);
                continue;
            }

            Method method = null;
            try {
                String methodName = "get" + StrUtil.upperFirst(field.getName());
                method = clazzQ.getMethod(methodName);
            } catch (NoSuchMethodException e) {
                log.info("查询字段在实体类没有找到方法,colum:{}", col);
                continue;
            }

            Object value;
            try {
                value = method.invoke(entity);
            } catch (InvocationTargetException | IllegalAccessException e) {
                log.info("查询字段在GET方法执行失败,colum:{}", col);
                continue;
            }
            if (value == null) {
                continue;
            }
            String colQuery = StrUtil.toUnderlineCase(col);
            if (value instanceof String valQuery) {
                if (StrUtil.isBlank(valQuery) || valQuery.length() == 0) {
                    continue;
                }
                if (valQuery.charAt(0) == ':') {
                    wrapper.like(colQuery, StrUtil.subAfter(valQuery, ":", false));
                } else if (valQuery.contains(",")) {
                    List<String> existInList = Arrays.asList(valQuery.split(","));
                    wrapper.in(colQuery, existInList);
                } else if (valQuery.contains("~")) {
                    List<String> betweenList = Arrays.asList(valQuery.split("~"));
                    wrapper.between(colQuery, betweenList.get(0), betweenList.get(1));
                } else {
                    wrapper.eq(colQuery, valQuery);
                }
            } else {
                wrapper.eq(colQuery, value);
            }
        }
        return wrapper;
    }

    private static <K> Field recursionField(Class<K> clazz, String field) {
        Field f = null;
        if (clazz == null) {
            return null;
        }
        try {
            f = clazz.getDeclaredField(field);
        } catch (NoSuchFieldException e) {
            return recursionField(clazz.getSuperclass(), field);
        }
        return f;
    }
}
