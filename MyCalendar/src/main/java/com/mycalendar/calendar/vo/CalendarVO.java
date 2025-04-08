package com.mycalendar.calendar.vo;

import java.sql.Timestamp;
import java.util.Date;

import lombok.Data;

@Data
public class CalendarVO {
	private int id; // 글번호 
    private String title; // 일정 제목
    private String content; // 일정 내용(설명)
    private Timestamp start_date; // 일정 시작일
    private Timestamp end_date; // 일정 종료일
    private String color; // 일정 색(구분)
    private String email; // 로그인 한 사용자(작성자)
    private String all_Day; // Oracle에서는 BOOLEAN이 없어서 문자열로 처리 ("true"/"false")
    private Date reg_date; // 일정 등록일
}
