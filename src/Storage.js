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

export default Storage;