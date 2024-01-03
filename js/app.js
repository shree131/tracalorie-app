class CalorieTracker {
    #calorieLimit = 2000;
    #totalCalories = 0;
    #meals = [];
    #workouts = [];

    // Public Methods/API
    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        this.#displayNewMeal(meal);
        this.#renderStats();
    }

    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        this.#displayNewWorkout(workout);
        this.#renderStats();
    }

    resetDay() {
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];

        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
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

    #displayNewMeal(meal) {
        // Add to DOM
        const divCards = document.querySelector(`#meal-items`);
        const mealEl = document.createElement('div');

        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);

        mealEl.innerHTML = `<div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                >
                    ${parseInt(meal.calories)}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>`;

        divCards.appendChild(mealEl);
    }

    #displayNewWorkout(workout) {
        // Add to DOM
        const divCards = document.querySelector('#workout-items');
        const workoutEl = document.createElement('div');

        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id)

        workoutEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div
                class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
            >
                ${parseInt(workout.calories)}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>`;

        divCards.appendChild(workoutEl);
    }

    // Render Stats to DOM
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

class App {
    // Initialize Calorie Tracker
    #tracker = new CalorieTracker();

    constructor() {
        document.querySelector('#meal-form').addEventListener('submit', this.#newItem.bind(this, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', this.#newItem.bind(this, 'workout'));
    }

    #newItem(type, e) {
        e.preventDefault();
        const name = document.querySelector(`#${type}-name`).value;
        const calories = document.querySelector(`#${type}-calories`).value;

        // Validate input
        if (name === '' || calories === '') {
            alert('Input fields cannot be empty.');
            return;
        }

        // Initialize a meal and add to tracker
        type === 'meal' ? this.#tracker.addMeal(new Meal(name, parseInt(calories))) : this.#tracker.addWorkout(new Workout(name, calories));

        // Clear input fields
        document.querySelector(`#${type}-name`).value = '';
        document.querySelector(`#${type}-calories`).value = '';

        // Colapse bootstrap
        const collapseMeal = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });
    }

}

const app = new App();