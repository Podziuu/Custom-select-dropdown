export default class Select {
    constructor(element) {
        this.element = element;
        this.options = getOptions(element.querySelectorAll('option'));
        this.customElement = document.createElement('div');
        this.customLabel = document.createElement('span');
        this.customOptionsList = document.createElement('ul');
        setupCustomElements(this);
        element.after(this.customElement)
        element.style.display = 'none';
    }

    get selectedOption() {
        return this.options.find(option => option.selected)
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        });
        const prevSelectedOption = this.selectedOption
        prevSelectedOption.selected = false;
        prevSelectedOption.element.selected = false;

        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.customLabel.innerText = newSelectedOption.label
    }
}

function setupCustomElements(select) {
    select.customElement.classList.add('custom-select-container');
    select.customElement.tabIndex = 0;

    select.customLabel.classList.add('custom-select-label');
    select.customLabel.innerText = select.selectedOption.label
    select.customElement.append(select.customLabel);

    select.customOptionsList.classList.add('custom-select-options-list');
    select.options.forEach(option => {
        const optionLi = document.createElement('li');
        optionLi.classList.add('custom-select-option-li');
        optionLi.classList.toggle('selected', option.selected)
        optionLi.innerText = option.label;
        optionLi.dataset.value = option.value;
        optionLi.addEventListener('click', () => {
            select.customOptionsList.querySelector(`[data-value="${select.selectedOption.value}"]`).classList.remove('selected')
            select.selectValue(option.value);
            optionLi.classList.add('selected')
            select.customOptionsList.classList.remove('show')
        })
        select.customOptionsList.append(optionLi);
    })
    select.customElement.append(select.customOptionsList);

    select.customLabel.addEventListener('click', () => {
        select.customOptionsList.classList.toggle('show');
    })

    select.customElement.addEventListener('blur', () => {
        select.customOptionsList.classList.remove('show');
    })
}

function getOptions(options) {
    return [...options].map(option => {
        return {
            value: option.value,
            label: option.label,
            selected: option.selected,
            element: option
        }
    })
}