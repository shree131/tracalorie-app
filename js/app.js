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

class Storage {

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;

        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = parseInt(localStorage.getItem('calorieLimit'));
        }

        return calorieLimit;
    }

    static setTotalCalories(totalCalories) {
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getTotalCalories(defaultCalories = 0) {
        if (localStorage.getItem('totalCalories') === null) {
            return defaultCalories;
        } else {
            return parseInt(localStorage.getItem('totalCalories'));
        }
    }

    static getMeals() {
        if (localStorage.getItem('meals') === null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('meals'));
        }
    }

    static saveMeal(meal) {
        const mealsFromStorage = Storage.getMeals();
        mealsFromStorage.push(meal);
        localStorage.setItem('meals', JSON.stringify(mealsFromStorage));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();

        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        })

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts() {
        if (localStorage.getItem('workouts') === null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('workouts'));
        }
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();

        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        })

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll() {
        localStorage.clear();
    }

}

class App {
    // Initialize Calorie Tracker
    #tracker = new CalorieTracker();

    constructor() {
        this.#loadEventListeners();
        this.#tracker.loadItems();
    }

    #loadEventListeners() {
        // Form Submit Event Listeners
        document.querySelector('#meal-form').addEventListener('submit', this.#newItem.bind(this, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', this.#newItem.bind(this, 'workout'));

        // Delete Items Event Listeners
        document.querySelector('#meal-items').addEventListener('click', this.#removeItem.bind(this, 'meal'));
        document.querySelector('#workout-items').addEventListener('click', this.#removeItem.bind(this, 'workout'));

        // Filter Event Listener
        document.querySelector('#filter-meals').addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
        document.querySelector('#filter-workouts').addEventListener('keyup', this.#filterItems.bind(this, 'workout'));

        // Reset Day
        document.querySelector('#reset').addEventListener('click', this.#reset.bind(this));

        // Set Calorie Limit
        document.querySelector('#limit-form').addEventListener('submit', this.#setLimit.bind(this));
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
        type === 'meal' ? this.#tracker.addMeal(new Meal(name, parseInt(calories))) : this.#tracker.addWorkout(new Workout(name, parseInt(calories)));

        // Clear input fields
        document.querySelector(`#${type}-name`).value = '';
        document.querySelector(`#${type}-calories`).value = '';

        // Colapse bootstrap
        const collapseMeal = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });
    }

    #removeItem(type, e) {
        const target = e.target;

        // Check if target is a delete button
        if (!(target.classList.contains('delete') || target.classList.contains('fa-xmark'))) {
            return;
        };

        const id = parseInt((target.closest('.card').getAttribute('data-id')));

        // Remove from DOM
        target.closest('.card').remove();

        // Remove meal from calorie tracker - subtract calories (target.parentElx3)
        type == 'meal' ?
            this.#tracker.removeMeal(id) : this.#tracker.removeWorkout(id);
    }

    #filterItems(type, e) {
        const filterText = e.target.value.toLowerCase();
        console.log(filterText);
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if (name.toLowerCase().includes(filterText)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    #reset(e) {
        this.#tracker.resetDay();
    }

    #setLimit(e) {
        e.preventDefault();
        const input = document.querySelector('#limit').value;

        if (Number.isInteger(parseInt(input)) && input >= 0) {
            this.#tracker.setLimit(parseInt(input));

            const modalEl = document.querySelector('#limit-modal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        } else {
            alert('Please enter a valid value.');
            return;
        }
    }

}

const app = new App();