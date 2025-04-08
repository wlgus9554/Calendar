package com.mycalendar.member.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.mycalendar.member.mapper.MemberMapper;
import com.mycalendar.member.vo.LoginVO;
import com.mycalendar.member.vo.MemberVO;


@Service("memberServiceImpl")
@Qualifier("memberServiceImpl")
public class MemberServiceImpl implements MemberService {
	
	@Autowired
	private MemberMapper mapper;
	
	// 로그인
	@Override
	public LoginVO login(LoginVO vo) {
		// TODO Auto-generated method stub
		return mapper.login(vo);
	}

	// 회원가입
	@Override
	public Integer join(MemberVO vo) {
		// TODO Auto-generated method stub
		return mapper.join(vo);
	}
	
	// 회원 리스트 (관리자만)
	@Override
	public List<MemberVO> memberList() {
		// TODO Auto-generated method stub
		return mapper.memberList();
	}

	// 전체 데이터 조회 ( 회원 리스트 )
	@Override
	public Long getTotalRow() {
		// TODO Auto-generated method stub
		return mapper.getTotalRow();
	}

	// 회원 상세보기
	@Override
	public MemberVO view(String email) {
		// TODO Auto-generated method stub
		return mapper.view(email);
	}

	// 회원 정보 수정
	@Override
	public Integer memberUpdate(MemberVO vo) {
		// TODO Auto-generated method stub
		return mapper.memberUpdate(vo);
	}

	@Override
	public MemberVO getMemberByEmail(String email) {
	    return mapper.selectMemberByEmail(email);
	}

	@Override
	public Integer memberDelete(MemberVO vo) {
		// TODO Auto-generated method stub
		return mapper.memberDelete(vo);
	}

	@Override
	public Integer updateLastLogin(String email) {
		// TODO Auto-generated method stub
		return mapper.updateLastLogin(email);
	}



}
