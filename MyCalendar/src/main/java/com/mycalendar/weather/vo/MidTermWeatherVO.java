package com.mycalendar.weather.vo;

import lombok.Data;

@Data
public class MidTermWeatherVO {
    private String date;     // 예보 날짜
    private String weather;  // 예: 맑음, 흐림 등
}
// 이 VO는 테이블에 존재하진 않지만 예보 데이터는 날짜 별로 데이터가 변경되기 떄문에 API 응답에서 날짜별로 리스트의 형태로 받아서 VO 리스트로 처리해야함.
// DB에 저장하는 VO가 아닌 API 응답으로 일시적으로 사용하는 데이터임.