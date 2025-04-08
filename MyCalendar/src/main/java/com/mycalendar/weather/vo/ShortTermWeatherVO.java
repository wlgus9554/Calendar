package com.mycalendar.weather.vo;

import lombok.Data;

@Data
public class ShortTermWeatherVO {
    private String date;      // 예보 날짜 (yyyy-MM-dd)
    private String time;      // 시간 (예: 0900)
    private String temperature; // TMP
    private String sky;       // SKY (1:맑음, 3:구름많음, 4:흐림)
    private String precipitation; // POP (강수확률)
}
