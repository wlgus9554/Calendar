package com.mycalendar.member.controller;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.mycalendar.member.service.MemberService;
import com.mycalendar.member.vo.LoginVO;
import com.mycalendar.member.vo.MemberVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/member")
public class MemberController {

	// 파일 저장 경로
	String path = "/upload/member/";

	// 자동 DI
	// @Setter(onMethod_ = @Autowired)
	// Type이 같으면 식별할 수 있는 문자열 지정 - id 지정
	@Autowired
	@Qualifier("memberServiceImpl")
	private MemberService service;

	private static final Logger log = LoggerFactory.getLogger(MemberController.class);

	// --- 회원가입 처리 ------------------------------------
	@PostMapping("/join.do")
	public ResponseEntity<MemberVO> write(MemberVO vo,
			@RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws Exception {
		log.info("----------[ join.do ] -----------");

		if (imageFile == null || imageFile.isEmpty()) {
			log.warn("📛 이미지 파일이 null 또는 비어 있음!");
		} else {
			log.info("✅ 이미지 파일명: " + imageFile.getOriginalFilename());
		}

		vo.setGrade("user"); // 기본 셋팅값은 user로 강제 설정

		if (imageFile != null && !imageFile.isEmpty()) {
			String fileName = imageFile.getOriginalFilename();
			String fullPath = path + fileName;
			vo.setImage(fullPath); // ✅ 이거 꼭 해줘야 DB에 들어감!
			log.info("✅ 이미지 파일명: " + fullPath);
		} else {
			vo.setImage(path + "/default.jpg");
			log.warn("기본 이미지로 셋팅");
		}

		service.join(vo);

		return ResponseEntity.ok(vo); // 회원가입한 회원 정보
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginVO vo, HttpSession session) {
		log.info("로그인 요청: " + vo);

		LoginVO loginVO = service.login(vo);
		
		// 아이디 또는 비밀번호가 틀려서 로그인에 실패 시
		if (loginVO == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
		}

		// 탈퇴한 계정이 접속을 시도 시 
		if ("탈퇴".equals(loginVO.getStatus())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("탈퇴한 계정입니다.");
		}

		// ✅ 로그인 성공 시 마지막 로그인 시간 갱신
		service.updateLastLogin(loginVO.getEmail());

		// 세션에 이메일 저장
		session.setAttribute("email", loginVO.getEmail());
		return ResponseEntity.ok(loginVO);
	}

	// 로그아웃
	@PostMapping("/logout.do")
	public ResponseEntity<String> logout(HttpSession session) {

		log.info("logout.do");

		// email과 password를 vo에 설정 ( 데이터 손실 방지 )

		session.removeAttribute("login");

		return new ResponseEntity<String>("로그아웃", HttpStatus.OK);
	}

	// 회원 리스트
	@GetMapping("/memberList.do")
	public ResponseEntity<List<MemberVO>> list(Model model,
			@RequestParam(value = "email", required = false) String email) throws Exception {
		log.info(email);
		return new ResponseEntity<>(service.memberList(), HttpStatus.OK);
	}

	// 회원 상세보기 - 관리자만 가능
	@GetMapping("/view.do")
	public ResponseEntity<MemberVO> view(@RequestParam("email") String email) {

		log.info("view.do...........................");

		return new ResponseEntity<>(service.view(email), HttpStatus.OK);
	}

	// --- 회원 정보 수정 처리 ------------------------------------
	@PostMapping("/memberUpdate.do")
	public ResponseEntity<MemberVO> memberUpdate(MemberVO vo, @RequestParam("imageFile") MultipartFile imageFile)
			throws Exception {
		log.info("----------[ memberUpdate.do ] -----------");
		
		log.info("등급: " + vo.getGrade());
		log.info("상태: " + vo.getStatus());

		if (imageFile == null || imageFile.isEmpty()) {
			log.warn("📛 이미지 파일이 null 또는 비어 있음!");
		} else {
			log.info("✅ 이미지 파일명: " + imageFile.getOriginalFilename());
		}

		if (imageFile != null && !imageFile.isEmpty()) {
			String fileName = imageFile.getOriginalFilename();
			String fullPath = path + fileName;
			vo.setImage(fullPath); // ✅ 이거 꼭 해줘야 DB에 들어감!
			log.info("✅ 이미지 파일명: " + fullPath);
		} else {
			vo.setImage(path + "default.jpg");
			log.warn("기본 이미지로 셋팅");
		}

		service.memberUpdate(vo);

		return ResponseEntity.ok(vo); // 회원가입한 회원 정보
	}

	// 비밀번호 체크(수정)
	@PostMapping("/checkPassword.do")
	@ResponseBody
	public boolean checkPassword(@RequestBody MemberVO vo) {
		MemberVO db = service.getMemberByEmail(vo.getEmail());
		return db != null && db.getPassword().equals(vo.getPassword());
	}

	// 회원 탈퇴 처리
	@PostMapping("/memberDelete.do")
	@ResponseBody
	public String memberDelete(@RequestBody MemberVO vo) {
	    log.info("삭제 요청 email: {}", vo.getEmail());
	    log.info("삭제 요청 password: {}", vo.getPassword());

	    MemberVO member = service.getMemberByEmail(vo.getEmail());
	    if (member == null || !member.getPassword().equals(vo.getPassword())) {
	        return "fail";
	    }

	    vo.setStatus("탈퇴");
	    service.memberDelete(vo);
	    return "success";
	}

}
