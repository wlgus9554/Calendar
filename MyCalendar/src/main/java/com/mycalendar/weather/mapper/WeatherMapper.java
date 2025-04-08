package com.mycalendar.weather.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.mycalendar.weather.vo.WeatherVO;

@Mapper
public interface WeatherMapper {

	public WeatherVO findRegionbyWeather(String emall);
}
