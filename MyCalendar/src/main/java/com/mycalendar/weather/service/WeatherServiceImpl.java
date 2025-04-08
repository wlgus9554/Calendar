package com.mycalendar.weather.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycalendar.weather.mapper.WeatherMapper;
import com.mycalendar.weather.vo.WeatherVO;

@Service
public class WeatherServiceImpl implements WeatherService {
	
	@Autowired
	private WeatherMapper mapper;

	public WeatherVO findRegionbyWeather(String email){
		return mapper.findRegionbyWeather(email);
	}
}
