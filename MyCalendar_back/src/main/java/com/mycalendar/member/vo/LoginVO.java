package com.mycalendar.member.vo;

import lombok.Data;

@Data
public class LoginVO {

	private String email; // 아이디
	private String password; // 비밀번호
	private String name; // 이름
	private String image; // 사진 
	private String grade; // 회원등급
	private String nickName; // 닉네임
	private String status; // 상태 - 회원 탈퇴 확인용
}
