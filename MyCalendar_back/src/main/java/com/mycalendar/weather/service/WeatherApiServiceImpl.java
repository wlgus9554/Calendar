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
import java.util.*;

@Service
public class WeatherApiServiceImpl implements WeatherApiService {

    @Value("${weather.api.key}")
    private String weatherApiKey; // 중기예보용 키

    @Value("${short.api.key}")
    private String shortApiKey; // 단기예보용 키

    // ✅ 중기예보
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
                    vo.setWeather(getTagValue("wf" + d + "Am", el)); // 오전 날씨만
                    result.add(vo);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    // ✅ 단기예보
    @Override
    public List<ShortTermWeatherVO> getShortTermWeather(int nx, int ny) {
        List<ShortTermWeatherVO> result = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        String baseTime = getLatestShortTermBaseTime(now);
        String baseDate;

        if (now.getHour() < 2 || (now.getHour() == 2 && now.getMinute() < 10)) {
            baseDate = now.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        } else {
            baseDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        }

        String url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
                   + "?serviceKey=" + shortApiKey
                   + "&pageNo=1&numOfRows=1000&dataType=XML"
                   + "&base_date=" + baseDate
                   + "&base_time=" + baseTime
                   + "&nx=" + nx
                   + "&ny=" + ny;

        System.out.println("[단기예보 요청] base_date=" + baseDate + ", base_time=" + baseTime);
        System.out.println("[단기예보 URL] " + url);

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(url);
            doc.getDocumentElement().normalize();

            NodeList items = doc.getElementsByTagName("item");
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
                    case "TMP": vo.setTemperature(fcstValue); break;
                    case "SKY": vo.setSky(fcstValue); break;
                    case "POP": vo.setPrecipitation(fcstValue); break;
                }
            }

            result = new ArrayList<>(map.values());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    // 🔧 공통 유틸 함수들
    private String getTagValue(String tag, Element e) {
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() == 0) return null;
        return nodeList.item(0).getTextContent();
    }

    private String getTargetDate(int dayOffset) {
        return LocalDate.now().plusDays(dayOffset).toString();
    }

    private String getLatestBaseTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime base = now.getHour() < 18 ? now.minusDays(1) : now;
        return base.format(DateTimeFormatter.ofPattern("yyyyMMdd1800"));
    }

    private String getLatestShortTermBaseTime(LocalDateTime now) {
        int hour = now.getHour();
        int minute = now.getMinute();

        if (hour < 2 || (hour == 2 && minute < 10)) return "2300";
        if (hour < 5 || (hour == 5 && minute < 10)) return "0200";
        if (hour < 8 || (hour == 8 && minute < 10)) return "0500";
        if (hour < 11 || (hour == 11 && minute < 10)) return "0800";
        if (hour < 14 || (hour == 14 && minute < 10)) return "1100";
        if (hour < 17 || (hour == 17 && minute < 10)) return "1400";
        if (hour < 20 || (hour == 20 && minute < 10)) return "1700";
        if (hour < 23 || (hour == 23 && minute < 10)) return "2000";
        return "2300";
    }

    private String formatDate(String yyyymmdd) {
        return LocalDate.parse(yyyymmdd, DateTimeFormatter.ofPattern("yyyyMMdd")).toString();
    }
}
