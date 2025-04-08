package com.mycalendar.weather.vo;

import lombok.Data;

@Data
public class WeatherVO {

	private String city; // member에 있는 city와 조인할 예정
	private int nx;
	private int ny;
	private String reg_code;
}
