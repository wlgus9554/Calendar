package com.mycalendar.weather.controller;

import com.mycalendar.weather.service.WeatherApiService;
import com.mycalendar.weather.service.WeatherService;
import com.mycalendar.weather.vo.MidTermWeatherVO;
import com.mycalendar.weather.vo.ShortTermWeatherVO;
import com.mycalendar.weather.vo.WeatherVO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService; // 중기예보
    
    @Autowired
    private WeatherApiService apiService; //단기예보

    // 중기예보
    @GetMapping("/mid")
    public ResponseEntity<List<MidTermWeatherVO>> getMidTerm(@RequestParam("email") String email) {
        WeatherVO wetherVO = weatherService.findRegionbyWeather(email);
        if (wetherVO == null) return ResponseEntity.notFound().build();

        List<MidTermWeatherVO> mid = apiService.getMidTermWeather(wetherVO.getReg_code());
        return ResponseEntity.ok(mid);
    }
    
    // 단기예보
    @GetMapping("/short")
    public ResponseEntity<List<ShortTermWeatherVO>> getShortTerm(@RequestParam("email") String email) {
        WeatherVO region = weatherService.findRegionbyWeather(email);
        if (region == null) return ResponseEntity.notFound().build();

        List<ShortTermWeatherVO> shortTerm = apiService.getShortTermWeather(region.getNx(), region.getNy());
        return ResponseEntity.ok(shortTerm);
    }
    
    // 단기 + 중기 = 통합
    @GetMapping("/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklyWeather(
        @RequestParam(name = "email", required = false) String email,
        @RequestParam(name = "city", required = false) String city
    ) {
        if (email != null) {
            WeatherVO region = weatherService.findRegionbyWeather(email);
            if (region == null) return ResponseEntity.notFound().build();

            List<ShortTermWeatherVO> shortList = apiService.getShortTermWeather(region.getNx(), region.getNy());
            List<MidTermWeatherVO> midList = apiService.getMidTermWeather(region.getReg_code());

            Map<String, Object> result = new HashMap<>();
            result.put("shortTerm", shortList);
            result.put("midTerm", midList);
            return ResponseEntity.ok(result);
        }

        if (city != null) {
            WeatherVO region = weatherService.findRegionByCity(city);
            if (region == null) return ResponseEntity.notFound().build();

            List<ShortTermWeatherVO> shortList = apiService.getShortTermWeather(region.getNx(), region.getNy());
            List<MidTermWeatherVO> midList = apiService.getMidTermWeather(region.getReg_code());

            Map<String, Object> result = new HashMap<>();
            result.put("shortTerm", shortList);
            result.put("midTerm", midList);
            return ResponseEntity.ok(result);
        }

        return ResponseEntity.badRequest().body(Map.of("error", "email 또는 city 파라미터 필요"));
    }
    
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAvailableCities() {
        List<String> cities = weatherService.getAllCities(); // SELECT DISTINCT city FROM weather
        return ResponseEntity.ok(cities);
    }


}
