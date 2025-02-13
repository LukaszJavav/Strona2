package com.example.Diet;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DietController {

    private DietService dietService;

    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    @GetMapping("/api/getRecipeForCPM")
    public List<Diet> getRecipeForCPM(@RequestParam int cpm) {
        return dietService.findCombinationForCPM(cpm);
    }
}

