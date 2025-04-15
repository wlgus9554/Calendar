package com.mycalendar.weather.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.mycalendar.weather.vo.WeatherVO;

@Mapper
public interface WeatherMapper {

	public WeatherVO findRegionbyWeather(String emall);
	
	public WeatherVO findRegionByCity(String city);
	
	public List<String> getAllCities(); // 추가

}
