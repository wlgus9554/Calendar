package com.mycalendar.calendar.vo;

import java.sql.Timestamp;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class CalendarVO {
	private int id; // 글번호 
    private String title; // 일정 제목
    private String content; // 일정 내용(설명)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
    private Timestamp start_date;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
    private Timestamp end_date;
    private String color; // 일정 색(구분)
    private String email; // 로그인 한 사용자(작성자)
    private String all_Day; // Oracle에서는 BOOLEAN이 없어서 문자열로 처리 ("true"/"false")
    private Date write_date; // 일정 등록일
}
