package com.mycalendar.calendar.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.mycalendar.calendar.vo.CalendarVO;
@Mapper
public interface CalendarMapper {

	// 캘린더 화면(리스트)
	public List<CalendarVO> CalendarList(@Param("email")String email);
	
	// 캘린더 일정 상세보기
	public CalendarVO CalendarView(@Param("id")int id);
	
	// 일정 등록(생성)
	public Integer CalendarWrite(CalendarVO vo);

	// 일정 수정
	public Integer CalendarUpdate(CalendarVO vo);
	
	// 일정 삭제
	public Integer CalendarDelete(int id);
	
}
