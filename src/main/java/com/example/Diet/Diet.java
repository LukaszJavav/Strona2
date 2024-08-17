package com.example.Diet;

import jakarta.persistence.*;


@Entity
 public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="dailyMeals")
    private String dailyMeals;
    @Column(name="description",length = 1024)
    private String description;
    @Column(name = "kcal")
    int kcal;

    public Diet(Long id, String dailyMeals, String description, int kcal) {
        this.id = id;
        this.dailyMeals = dailyMeals;
        this.description = description;
        this.kcal = kcal;
    }
    public Diet(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDailyMeals() {
        return dailyMeals;
    }

    public void setDailyMeals(String dailyMeals) {
        this.dailyMeals = dailyMeals;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getKcal() {
        return kcal;
    }

    public void setKcal(int kcal) {
        this.kcal = kcal;
    }

    @Override
    public String toString() {
        return "Diet{" +
                "id=" + id +
                ", dailyMeals='" + dailyMeals + '\'' +
                ", description='" + description + '\'' +
                ", kcal=" + kcal +
                '}';
    }


}
