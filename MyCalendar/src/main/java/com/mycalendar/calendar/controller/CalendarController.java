package com.mycalendar.calendar.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mycalendar.calendar.service.CalendarService;
import com.mycalendar.calendar.vo.CalendarVO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {
	
	@Autowired
	private CalendarService service; // 서비스 호출
	
	private static final Logger log = LoggerFactory.getLogger(CalendarController.class); // 로그 찍기

	// 캘린더 화면(리스트)
	@GetMapping("/calendarList.do")
	public ResponseEntity<?> CalendarList(HttpSession session) throws Exception {
		//String email = (String) session.getAttribute("email");

		
		String email = (String) session.getAttribute("email");
		if (email == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                             .body("로그인이 필요합니다.");
	    }
		// String email = "test@naver.com"; 
		// http://localhost:8080/api/calendar/calendarList.do - url로 백앤드 정상 작동 확인을 위한 하드코딩
		
		// List<CalendarVO> calendarList = service.CalendarList(email);
		return ResponseEntity.ok(service.CalendarList(email));
	}
	
	// 캘린더 일정 상세보기
	@GetMapping("/calendarView.do")
	public ResponseEntity<?> calendarView(@RequestParam("id") int id, HttpSession session, CalendarVO vo) {
		
		// 세션으로 email 가져오기
		String email = (String) session.getAttribute("email");
		
		// vo를 선언해 service에 있는 view(일정번호) 담기
		vo = service.CalendarView(id);
		log.info("현재 접속 아이디 = " + email);
		log.info("일정 작성자 아이디 = " + vo.getEmail());
		log.info("일정 색상 = " + vo.getColor());  // ✅ 여기 로그 찍어보자!
		 // 다른 사람의 일정 접근 방지
		if (vo != null && email != null && email.equals(vo.getEmail())) {
		    // 접근 허용
		} else {
		    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("접근 권한이 없습니다.");
		}

		
		return ResponseEntity.ok(vo);
	}
	
	// 일정 등록 
	@PostMapping("/calendarWrite.do")
	public ResponseEntity<?> calendarWrite(@RequestBody CalendarVO vo, HttpSession session){
		
		log.info("Calendar Write !!");
		log.info("📝 등록 요청: {}", vo);
		// 세션으로 email 가져오기
		String email = (String) session.getAttribute("email");
		if (email == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
	    }
		
		 // ✅ 종료일이 비어 있으면 시작일로 자동 설정
	    if (vo.getEnd_date() == null) {
	        vo.setEnd_date(vo.getStart_date());
	    }
	    
		vo.setEmail(email); // 세션에 있는 이메일로 일정 작성자 지정
		
		service.CalendarWrite(vo); // service로 넘겨줌
		
		return ResponseEntity.ok(vo);
	}
	
	// 캘린더 수정
	@PostMapping("calendarUpdate.do")
	public ResponseEntity<?> calendarUpdate(@RequestBody CalendarVO vo){
		log.info("----------[ calendarUpdate.do ] -----------");
		service.CalendarUpdate(vo);
		return ResponseEntity.ok(vo);
	}
	
	@PostMapping("calendarDelete.do")
	public ResponseEntity<?> calendarDelete(@RequestParam("id") int id) {
		service.CalendarDelete(id); // 서비스에서 삭제 처리
		return ResponseEntity.ok("일정이 삭제되었습니다.");
	}
	
}
