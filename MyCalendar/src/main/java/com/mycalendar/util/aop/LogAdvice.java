package com.mycalendar.util.aop;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

// 자동 생성 - @Controller, @RestController, @Service, @Repository, @Component, @~Advice
@Component
@Slf4j
@Aspect // AOP 프로그램 지정
public class LogAdvice {

	@Around("execution(* com.calendar.*.service.*ServiceImpl.*(..))")
	//ProceedingJoinPoint - 실행 해야할 객체(~ServiceImpl) + parameter
	public Object logTime(ProceedingJoinPoint pjp) throws Throwable {
		
		// 결과를 저장하는 변수
		Object result = null;
		
		// 시작 시간 저장
		long start = System.currentTimeMillis();
		
		log.info("+*******[AOP 실행 전 로그 출력]*****************************+");
		
		// 실행되는 객체의 이름 출력
		// log.info("+ 실행 객체 : " + pjp.getTarget());
		log.info("+ 실행 객체와 메서드 : " + pjp.getSignature());
		// 전달되는 파라메터 데이터 출력
		log.info("+ 전달 데이터 : " + Arrays.toString(pjp.getArgs()));
		log.info("+*****************************************************+");
		
		
		// 실행하는 부분 - 다른 AOP 가 있으면 그쪽으로 가서 진행 처리하세요.
		result = pjp.proceed();

		log.info("+*******[AOP 실행 후 로그 출력]*****************************+");
		// 실행한 결과 데이터 출력
		log.info("+ 결과 데이터 : " + result);
		
		// 시작 시간 저장
		long end = System.currentTimeMillis();
		
		// 실행한 시간 출력 - 1/1000 초
		log.info("+ 소요 시간 : " + (end - start));
		log.info("+*****************************************************+");
		
		// 처리 시간 출력
		return result;
	}
	
}
