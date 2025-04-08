package com.mycalendar.member.vo;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class MemberVO {
	
	private String email; // 아이디
	private String nickName; // 닉네임
	private String name; // 이름
	private String password; // 비밀번호
	@DateTimeFormat(pattern = "yyyy-MM-dd") // 날짜 변환을 위한 어노테이션 추가
	private Date birth; // 생년월일
	private String gender; // 성별
	private String tel; // 전화번호
	private String city; // 도시
	// private String country; // 국가코드
	private Date regDate; // 가입일
	private Date last_login; // 마지막 접속일
	private String status; // 상태
	private String grade; // 회원등급
	private String image; // 이미지 사진

}
