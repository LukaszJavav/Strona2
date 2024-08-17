package com.example.Diet;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
@Service
public class DietService {
    private final DietRepository dietRepository;
    private final Random random = new Random();

    public DietService(DietRepository dietRepository) {
        this.dietRepository = dietRepository;
    }

    public List<Diet> getMeals() {
        List<Diet> meals = new ArrayList<>();
        dietRepository.findAll().forEach(meals::add);
        return meals;
    }
    public List<Diet> findCombinationForCPM(int targetKcal) {
        List<Diet> meals = getMeals();
        Map<String, List<Diet>> categorizedMeals = categorizeMeals(meals);
        List<Diet> result = new ArrayList<>();
        boolean found = false;
        int attempts = 0;
        int maxAttempts = 1000; // Limitujemy liczbę prób, aby uniknąć nieskończonej pętli

        while (!found && attempts < maxAttempts) {
            result.clear(); // Clear previous results
            found = findCombination(categorizedMeals, targetKcal, result);
            attempts++;
        }

        if (!found) {
            return Collections.emptyList(); // Jeśli nie znaleziono odpowiedniej kombinacji
        }

        // Adjust the total calorie count to be close to targetKcal
        adjustTotalCalories(result, targetKcal);

        return result;
    }

    private Map<String, List<Diet>> categorizeMeals(List<Diet> meals) {
        Map<String, List<Diet>> categorizedMeals = new HashMap<>();
        for (Diet diet : meals) {
            categorizedMeals.computeIfAbsent(diet.getDailyMeals(), k -> new ArrayList<>()).add(diet);
        }
        return categorizedMeals;
    }

    private boolean findCombination(Map<String, List<Diet>> categorizedMeals, int targetKcal, List<Diet> result) {
        Map<String, int[]> calorieLimits = getCalorieLimits(targetKcal);
        List<String> requiredMeals = Arrays.asList("Śniadanie", "Drugie śniadanie", "Obiad", "Podwieczorek", "Kolacja", "Przekąska");

        for (String mealType : requiredMeals) {
            List<Diet> categoryMeals = categorizedMeals.getOrDefault(mealType, new ArrayList<>());
            List<Diet> filteredMeals;

            if (mealType.equals("Śniadanie") || mealType.equals("Obiad") || mealType.equals("Kolacja")) {
                int[] limits = calorieLimits.get(mealType);
                filteredMeals = categoryMeals.stream()
                        .filter(meal -> meal.getKcal() >= limits[0] && meal.getKcal() <= limits[1])
                        .collect(Collectors.toList());
            } else {
                filteredMeals = new ArrayList<>(categoryMeals);
            }

            if (filteredMeals.isEmpty()) {
                return false; // Jeśli nie ma dostępnych posiłków dla określonego typu, wróć fałsz
            }

            Diet selectedMeal = filteredMeals.get(random.nextInt(filteredMeals.size()));
            result.add(selectedMeal);
        }

        int currentSum = result.stream().mapToInt(Diet::getKcal).sum();
        int lowerBound = targetKcal - 50;
        int upperBound = targetKcal + 50;

        return currentSum >= lowerBound && currentSum <= upperBound;
    }

    private void adjustTotalCalories(List<Diet> result, int targetKcal) {
        int currentSum = result.stream().mapToInt(Diet::getKcal).sum();
        int lowerBound = targetKcal - 50;
        int upperBound = targetKcal + 50;

        while (currentSum < lowerBound || currentSum > upperBound) {
            if (currentSum < lowerBound) {
                // Dodaj losowy posiłek, aby zwiększyć kalorie
                Optional<Diet> additionalMeal = getRandomMeal();
                additionalMeal.ifPresent(result::add);
            } else {
                // Usuń losowy posiłek, aby zmniejszyć kalorie
                result.remove(random.nextInt(result.size()));
            }
            currentSum = result.stream().mapToInt(Diet::getKcal).sum();
        }
    }

    private Optional<Diet> getRandomMeal() {
        List<Diet> meals = getMeals();
        if (!meals.isEmpty()) {
            return Optional.of(meals.get(random.nextInt(meals.size())));
        }
        return Optional.empty();
    }

    private Map<String, int[]> getCalorieLimits(int targetKcal) {
        Map<String, int[]> calorieLimits = new HashMap<>();
        if (targetKcal < 1300) {
            calorieLimits.put("Śniadanie", new int[]{150, 300});
            calorieLimits.put("Obiad", new int[]{300, 500});
            calorieLimits.put("Kolacja", new int[]{200, 300});
        } else if (targetKcal < 1500) {
            calorieLimits.put("Śniadanie", new int[]{200, 400});
            calorieLimits.put("Obiad", new int[]{300, 500});
            calorieLimits.put("Kolacja", new int[]{200, 400});
        } else if (targetKcal < 2000) {
            calorieLimits.put("Śniadanie", new int[]{200, 400});
            calorieLimits.put("Obiad", new int[]{400, 600});
            calorieLimits.put("Kolacja", new int[]{400, 600});
        } else if (targetKcal < 2300) {
            calorieLimits.put("Śniadanie", new int[]{300, 500});
            calorieLimits.put("Obiad", new int[]{500, 700});
            calorieLimits.put("Kolacja", new int[]{400, 650});
        } else if (targetKcal < 2600) {
            calorieLimits.put("Śniadanie", new int[]{400, 600});
            calorieLimits.put("Obiad", new int[]{500, 800});
            calorieLimits.put("Kolacja", new int[]{450, 750});
        } else if (targetKcal < 3000) {
            calorieLimits.put("Śniadanie", new int[]{400, 600});
            calorieLimits.put("Obiad", new int[]{600, 1000});
            calorieLimits.put("Kolacja", new int[]{600, 900});
        } else if (targetKcal < 3500) {
            calorieLimits.put("Śniadanie", new int[]{400, 700});
            calorieLimits.put("Obiad", new int[]{700, 1300});
            calorieLimits.put("Kolacja", new int[]{700, 1000});
        } else if (targetKcal < 4000) {
            calorieLimits.put("Śniadanie", new int[]{500, 800});
            calorieLimits.put("Obiad", new int[]{900, 1500});
            calorieLimits.put("Kolacja", new int[]{700, 1400});
        } else if (targetKcal < 4500) {
            calorieLimits.put("Śniadanie", new int[]{500, 900});
            calorieLimits.put("Obiad", new int[]{1000, 1800});
            calorieLimits.put("Kolacja", new int[]{800, 1500});
        } else if (targetKcal < 5000) {
            calorieLimits.put("Śniadanie", new int[]{600, 1200});
            calorieLimits.put("Obiad", new int[]{1200, 2000});
            calorieLimits.put("Kolacja", new int[]{1000, 1800});
        } else if (targetKcal < 5500) {
            calorieLimits.put("Śniadanie", new int[]{800, 1500});
            calorieLimits.put("Obiad", new int[]{1400, 2400});
            calorieLimits.put("Kolacja", new int[]{1300, 2000});
        } else if (targetKcal < 6000) {
            calorieLimits.put("Śniadanie", new int[]{1200, 2000});
            calorieLimits.put("Obiad", new int[]{1500, 2500});
            calorieLimits.put("Kolacja", new int[]{1500, 2200});
        }

        return calorieLimits;
    }
}






