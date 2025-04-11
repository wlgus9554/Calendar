package com.mycalendar.weather.service;

import java.util.List;

import com.mycalendar.weather.vo.WeatherVO;

public interface WeatherService {

	public WeatherVO findRegionbyWeather(String email);
	
	public WeatherVO findRegionByCity(String city);  // 🔍 추가
	
	public List<String> getAllCities(); // 추가

}
