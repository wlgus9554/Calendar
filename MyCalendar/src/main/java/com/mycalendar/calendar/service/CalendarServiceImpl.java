package com.mycalendar.calendar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.mycalendar.calendar.mapper.CalendarMapper;
import com.mycalendar.calendar.vo.CalendarVO;
@Service("CalendarServiceImpl")
@Qualifier("CalendarServiceImpl")
public class CalendarServiceImpl implements CalendarService {

	 @Autowired
	private CalendarMapper mapper;
	
	// 캘린더 리스트
	@Override
	public List<CalendarVO> CalendarList(@RequestParam("email") String email) {
		return mapper.CalendarList(email);
	}

	// 일정 상세보기
	@Override
	public CalendarVO CalendarView(@Param("id")int id) {
		// TODO Auto-generated method stub
		return mapper.CalendarView(id);
	}

	// 일정 등록
	@Override
	public Integer CalendarWrite(CalendarVO vo) {
		// TODO Auto-generated method stub
		return mapper.CalendarWrite(vo);
	}

	// 일정 수정
	@Override
	public Integer CalendarUpdate(CalendarVO vo) {
		// TODO Auto-generated method stub
		return mapper.CalendarUpdate(vo);
	}

	// 일정 삭제
	@Override
	public Integer CalendarDelete(int id) {
		// TODO Auto-generated method stub
		return mapper.CalendarDelete(id);
	}

}
