package com.mycalendar.weather.service;

import java.util.List;

import com.mycalendar.weather.vo.MidTermWeatherVO;
import com.mycalendar.weather.vo.ShortTermWeatherVO;

public interface WeatherApiService {
	// 중기예보 조회
	public List<MidTermWeatherVO> getMidTermWeather(String regCode);
	
	// 단기예보 조회
	public List<ShortTermWeatherVO> getShortTermWeather(int nx, int ny);

}

