package com.example.PPM;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class PpmCalculatorController {

    @GetMapping("/")
    public String showForm() {
        return "index";
    }
}
