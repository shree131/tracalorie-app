import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css';
import './css/style.css';

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
        const bsCollapse = new Collapse(collapseMeal, {
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
            const modal = Modal.getInstance(modalEl);
            modal.hide();
        } else {
            alert('Please enter a valid value.');
            return;
        }
    }

}

const app = new App();