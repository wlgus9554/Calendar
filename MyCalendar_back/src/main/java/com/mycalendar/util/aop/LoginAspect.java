package com.mycalendar.util.aop;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import lombok.extern.slf4j.Slf4j;
import java.lang.reflect.Method;

@Aspect
@Component
@Slf4j  // 로그 사용
public class LoginAspect {

    @Before("@annotation(com.mycalendar.util.aop.LoginRequired)")
    public void checkLogin(JoinPoint joinPoint) throws Throwable {
        // 현재 요청의 HttpServletRequest 가져오기
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            log.error("🚨 [AOP] 요청 정보를 가져올 수 없습니다.");
            throw new RuntimeException("요청 정보를 찾을 수 없습니다.");
        }

        HttpServletRequest request = attributes.getRequest();
        HttpSession session = request.getSession(false); // 세션이 없으면 null 반환

        Object user = (session != null) ? session.getAttribute("login") : null;

        log.info("🔍 [AOP] 세션에서 가져온 user 값: {}", user); // 디버깅 로그 추가

        if (user == null) {
            log.error("🚫 [AOP] 로그인되지 않은 사용자 접근 차단! Method: {}", getMethodName(joinPoint));
            throw new RuntimeException("로그인이 필요합니다.");
        }

        log.info("✅ [AOP] 로그인 확인 완료 - user: {}", user);
    }

    // 실행 중인 메서드명을 가져오는 헬퍼 메서드
    private String getMethodName(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        return method.getDeclaringClass().getSimpleName() + "." + method.getName();
    }
}
