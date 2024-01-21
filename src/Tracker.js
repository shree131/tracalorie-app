import Storage from './Storage';

class CalorieTracker {
    #calorieLimit = Storage.getCalorieLimit();
    #totalCalories = Storage.getTotalCalories();
    #meals = Storage.getMeals();
    #workouts = Storage.getWorkouts();

    constructor() {
        document.querySelector('#limit').value = this.#calorieLimit;
        this.#renderStats();
    }

    // Public Methods/API
    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;

        Storage.setTotalCalories(this.#totalCalories);
        Storage.saveMeal(meal);

        this.#displayNewMeal(meal);
        this.#renderStats();
    }

    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;

        Storage.setTotalCalories(this.#totalCalories);
        Storage.saveWorkout(workout);

        this.#displayNewWorkout(workout);
        this.#renderStats();
    }

    removeMeal(mealId) {
        this.#meals = this.#meals.filter(item => {
            if (item.id === mealId) {
                this.#totalCalories -= item.calories;

                Storage.setTotalCalories(this.#totalCalories);
                Storage.removeMeal(mealId);
                this.#renderStats();

                return false; // Exclude the item from the array
            }
            return true; // Include the item in the array
        });
        this.#displayCaloriesConsumed();
    }

    removeWorkout(workoutId) {
        this.#workouts = this.#workouts.filter(item => {
            if (item.id === workoutId) {
                this.#totalCalories += item.calories;

                Storage.setTotalCalories(this.#totalCalories);
                Storage.removeWorkout(workoutId);
                this.#renderStats();

                return false; // Exclude the item from the array
            }
            return true; // Include the item in the array
        });
        this.#displayCaloriesBurned();
    }

    resetDay() {
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];

        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';

        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';

        Storage.clearAll();
        this.#calorieLimit = Storage.getCalorieLimit();
        this.#renderStats();
    }

    setLimit(limitValue) {
        // this.#calorieLimit = limitValue;
        Storage.setCalorieLimit(limitValue);
        this.#calorieLimit = Storage.getCalorieLimit();
        this.#displayCalorieLimit();
        this.#renderStats();
    }

    loadItems() {
        this.#meals.forEach(meal => this.#displayNewMeal(meal));
        this.#workouts.forEach(workout => this.#displayNewWorkout(workout));
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

    #displayCaloriesConsumed() {
        const calorieConsumed = document.querySelector('#calories-consumed');
        const totalConsumed = this.#meals.reduce((total, meal) => total += meal.calories, 0);
        calorieConsumed.innerText = totalConsumed;
    }

    #displayCaloriesBurned() {
        const calorieBurned = document.querySelector('#calories-burned');
        const totalBurned = this.#workouts.reduce((total, workout) => total += workout.calories, 0);
        calorieBurned.innerText = totalBurned;
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

export default CalorieTracker;