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

    #displayProgressBar() {
        const progressBarEl = document.querySelector('#calorie-progress');
        const progressPercent = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(progressPercent, 100);

        progressBarEl.style.width = `${width}%`;
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
        const progressBarEl = document.querySelector('#calorie-progress');

        if (calorieRemaining.textContent < 0) {
            calorieRemaining.parentElement.parentElement.classList.remove('bg-light');
            calorieRemaining.parentElement.parentElement.classList.add('bg-danger');

            progressBarEl.classList.remove('bg-sucess');
            progressBarEl.classList.add('bg-danger');
        } else {
            calorieRemaining.parentElement.parentElement.classList.remove('bg-danger');
            calorieRemaining.parentElement.parentElement.classList.add('bg-light');
            progressBarEl.classList.add('bg-sucess');
            progressBarEl.classList.remove('bg-danger');
        }
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

    #renderStats() {
        this.#displayCaloriesTotal();
        this.#displayCalorieLimit();
        this.#displayCaloriesRemaining();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();;
        this.#displayProgressBar()
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
const lunch = new Meal('Sandwich', 2000);

calorieTracker.resetDay();
calorieTracker.addMeal(breakfast);
calorieTracker.addMeal(lunch);

// Initialize a workout
const run = new Workout('Morning Jog', 100);
const yoga = new Workout('Yoga', 50);
const yoga2 = new Workout('Yoga2', 50);

calorieTracker.addWorkout(run);
calorieTracker.addWorkout(yoga);
calorieTracker.addWorkout(yoga2);