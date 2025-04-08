package com.mycalendar.weather.service;

import com.mycalendar.weather.vo.WeatherVO;

public interface WeatherService {

	public WeatherVO findRegionbyWeather(String email);
}
