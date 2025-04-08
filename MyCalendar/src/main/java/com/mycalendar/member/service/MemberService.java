package com.mycalendar.member.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.mycalendar.member.vo.LoginVO;
import com.mycalendar.member.vo.MemberVO;

public interface MemberService {

	// 로그인
	public LoginVO login(LoginVO vo);
	
	// 회원가입
	public Integer join(MemberVO vo);

	// 회원리스트
	public List<MemberVO> memberList();
	
	// 전체 회원 조회
	public Long getTotalRow();
	
	// 선택한 회원의 정보 상세보기
	public MemberVO view(@Param("email") String email);
	
	// 회원 정보 수정
	public Integer memberUpdate(MemberVO vo);
	
	// 수정 이메일 체크
	public MemberVO getMemberByEmail(String email);
	
	// 회원 정보 수정
	public Integer memberDelete(MemberVO vo);
	
	// 마지막 로그인 날짜 업데이트
	public Integer updateLastLogin(String email);

}
