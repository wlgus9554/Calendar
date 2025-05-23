package com.mycalendar.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import com.mycalendar.member.vo.LoginVO;
import com.mycalendar.member.vo.MemberVO;

@Repository
@Mapper
public interface MemberMapper {
	
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
	public Integer memberUpdate (MemberVO vo);
	
	// 수정 이메일 체크
	MemberVO selectMemberByEmail(String email);

	// 회원 정보 수정
	public Integer memberDelete (MemberVO vo);
	
	// 마지막 로그인 날짜 업데이트
	public Integer updateLastLogin(String email);
	
	// 이메일 확인
	public LoginVO findByEmail(String email);
	
	// 회원 삭제(관리자)
	public Integer deleteUser(String email);

}
