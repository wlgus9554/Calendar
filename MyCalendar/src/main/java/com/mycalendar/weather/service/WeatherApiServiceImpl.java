package com.mycalendar.weather.service;

import com.mycalendar.weather.vo.MidTermWeatherVO;
import com.mycalendar.weather.vo.ShortTermWeatherVO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherApiServiceImpl implements WeatherApiService {

    @Value("${weather.api.key}")
    private String weatherApiKey; // 중기예보용 키
    
    @Value("${short.api.key}")
    private String shortApiKey; // 단기예보용 키

    // 중기예보 
    @Override
    public List<MidTermWeatherVO> getMidTermWeather(String regCode) {
        List<MidTermWeatherVO> result = new ArrayList<>();

        String baseDateTime = getLatestBaseTime(); // 예: 202404071800
        String url = "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst"
                   + "?serviceKey=" + weatherApiKey
                   + "&pageNo=1&numOfRows=10&dataType=XML"
                   + "&regId=" + regCode
                   + "&tmFc=" + baseDateTime;

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(url);
            doc.getDocumentElement().normalize();

            NodeList items = doc.getElementsByTagName("item");
            for (int i = 0; i < items.getLength(); i++) {
                Element el = (Element) items.item(i);
                for (int d = 3; d <= 7; d++) {
                    MidTermWeatherVO vo = new MidTermWeatherVO();
                    vo.setDate(getTargetDate(d)); // 오늘 + d일
                    vo.setWeather(getTagValue("wf" + d + "Am", el)); // 오전 날씨만 예시
                    result.add(vo);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    private String getTargetDate(int dayOffset) {
        return LocalDate.now().plusDays(dayOffset).toString(); // YYYY-MM-DD
    }

    private String getLatestBaseTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime base = now.getHour() < 18 ? now.minusDays(1) : now;
        return base.format(DateTimeFormatter.ofPattern("yyyyMMdd1800"));
    }

    private String getTagValue(String tag, Element e) {
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() == 0) return null;
        return nodeList.item(0).getTextContent();
    }
    
    @Override
    public List<ShortTermWeatherVO> getShortTermWeather(int nx, int ny) {
    	
        List<ShortTermWeatherVO> result = new ArrayList<>();

        String baseDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseTime = "0500"; // 안정적인 기준 시간

        String url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
                   + "?serviceKey=" + shortApiKey
                   + "&pageNo=1&numOfRows=1000&dataType=XML"
                   + "&base_date=" + baseDate
                   + "&base_time=" + baseTime
                   + "&nx=" + nx
                   + "&ny=" + ny;

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(url);
            doc.getDocumentElement().normalize();

            NodeList items = doc.getElementsByTagName("item");

            // 날짜+시간 기준으로 데이터를 하나로 묶기 위한 Map
            Map<String, ShortTermWeatherVO> map = new LinkedHashMap<>();

            for (int i = 0; i < items.getLength(); i++) {
                Element el = (Element) items.item(i);

                String fcstDate = getTagValue("fcstDate", el);
                String fcstTime = getTagValue("fcstTime", el);
                String category = getTagValue("category", el);
                String fcstValue = getTagValue("fcstValue", el);

                String key = fcstDate + fcstTime;

                map.putIfAbsent(key, new ShortTermWeatherVO());
                ShortTermWeatherVO vo = map.get(key);
                vo.setDate(formatDate(fcstDate));
                vo.setTime(fcstTime);

                switch (category) {
                    case "TMP":
                        vo.setTemperature(fcstValue);
                        break;
                    case "SKY":
                        vo.setSky(fcstValue);
                        break;
                    case "POP":
                        vo.setPrecipitation(fcstValue);
                        break;
                }
            }

            result = new ArrayList<>(map.values());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
    
    private String formatDate(String yyyymmdd) {
        return LocalDate.parse(yyyymmdd, DateTimeFormatter.ofPattern("yyyyMMdd"))
                        .toString(); // yyyy-MM-dd
    }

}
