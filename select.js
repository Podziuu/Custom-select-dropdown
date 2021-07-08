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

    get selectedOptionindex() {
        return this.options.indexOf(this.selectedOption);
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
        this.customOptionsList.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected')
        const newOption = this.customOptionsList.querySelector(`[data-value="${newSelectedOption.value}"]`)
        newOption.classList.add('selected');
        newOption.scrollIntoView({block: 'nearest'});
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
            select.selectValue(option.value);
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

    let debounceTime;
    let searchedTerm = '';
    select.customElement.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
            select.customOptionsList.classList.toggle('show');
                break;
            case "ArrowUp":
                const prevOption = select.options[select.selectedOptionindex -1];
                if(prevOption) {
                    select.selectValue(prevOption.value)
                }
                break;
            case 'ArrowDown':
                const nextOption = select.options[select.selectedOptionindex + 1];
                if(nextOption) {
                    select.selectValue(nextOption.value);
                }
                break;
            case "Enter":
            case "Escape":
                select.customOptionsList.classList.remove('show');
            default:
                clearTimeout(debounceTime);
                searchedTerm += e.key
                debounceTime = setTimeout(() => {
                    searchedTerm = ''
                }, 500);

            const searchedOption = select.options.find(option => {
                return option.label.toLowerCase().startsWith(searchedTerm);
            })
            if(searchedOption) select.selectValue(searchedOption.value);
        }
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