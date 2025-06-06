package com.mycalendar.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/{path:^(?!api|upload|static|favicon\\.ico|.*\\..*).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}
