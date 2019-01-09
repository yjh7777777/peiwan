package com.peiwan.bean;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author bjlz
 * @since 2019-01-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("a_attention")
public class AAttention implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * 用户id
     */
    @TableId(value = "pid")
    private Integer pid;

    /**
     * 关注列表id
     */
    private Integer aid;

    /**
     * 导师id
     */
    private Integer zid;

    /**
     * 主播标识
     */
    private Integer zZhubo;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Integer getAid() {
        return aid;
    }

    public void setAid(Integer aid) {
        this.aid = aid;
    }

    public Integer getZid() {
        return zid;
    }

    public void setZid(Integer zid) {
        this.zid = zid;
    }

    public Integer getzZhubo() {
        return zZhubo;
    }

    public void setzZhubo(Integer zZhubo) {
        this.zZhubo = zZhubo;
    }
}
