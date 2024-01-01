class CalorieTracker {
    #calorieLimit = 2000;
    #totalCalories = 0;
    #meals = [];
    #workouts = [];

    // Public Methods/API
    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        this.#renderStats();
    }

    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        this.#renderStats();
    }

    resetDay() {
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        this.#renderStats();
    }

    // Private Methods
    #renderStats() {
        this.#displayCaloriesTotal();
        this.#displayCalorieLimit();
        this.#displayCaloriesRemaining();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
    }

    #displayCaloriesTotal() {
        const caloriesTotal = document.querySelector('#calories-total');

        caloriesTotal.innerHTML = '';
        const value = document.createTextNode(this.#totalCalories);
        caloriesTotal.appendChild(value);
    }

    #displayCalorieLimit() {
        const calorieLimit = document.querySelector('#calories-limit');

        calorieLimit.innerHTML = '';
        const value = document.createTextNode(this.#calorieLimit);
        calorieLimit.appendChild(value);
    }

    #displayCaloriesRemaining() {
        const calorieRemaining = document.querySelector('#calories-remaining');
        calorieRemaining.textContent = this.#calorieLimit - this.#totalCalories;
    }

    #displayCaloriesConsumed(calories) {
        const calorieConsumed = document.querySelector('#calories-consumed');
        const totalConsumed = this.#meals.reduce((total, meal) => total += meal.calories, 0);
        calorieConsumed.textContent = totalConsumed;
    }

    #displayCaloriesBurned(calories) {
        const calorieBurned = document.querySelector('#calories-burned');
        const totalBurned = this.#workouts.reduce((total, workout) => total += workout.calories, 0);
        calorieBurned.textContent = totalBurned;
    }


}

class Meal {
    constructor(name, calories) {
        this.id = Date.now();
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Date.now();
        this.name = name;
        this.calories = calories;
    }
}

// Initialize Calorie Tracker
const calorieTracker = new CalorieTracker();

// Initialize a meal
const breakfast = new Meal('Toast', 200);
const lunch = new Meal('Sandwich', 500);

calorieTracker.resetDay();
calorieTracker.addMeal(breakfast);
calorieTracker.addMeal(lunch);

// Initialize a workout
const run = new Workout('Morning Jog', 100);
const yoga = new Workout('Yoga', 50);

calorieTracker.addWorkout(run);
calorieTracker.addWorkout(yoga);