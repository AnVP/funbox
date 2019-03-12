  const ENTER_KEYCODE = 13;
const form = document.querySelector(`.cat-product__form`);
const cards = form.querySelectorAll(`.card`);
const inputs = form.querySelectorAll(`.cat-product__input`);
const btns = form.querySelectorAll(`.card__description--link`);

let defaultCard = (i) => {
  cards[i].classList.add(`card--default`);
  cards[i].classList.remove(`card--selected`);
  cards[i].classList.remove(`card--disabled`);
  cards[i].addEventListener(`mouseenter`, () => {
    cards[i].classList.add(`card--default-hover`);
    cards[i].classList.remove(`card--selected-hover`);
  });
  cards[i].addEventListener(`mouseleave`, () => {
    cards[i].classList.remove(`card--default-hover`);
  });
  cards[i].classList.remove(`card--selected-hover`);
}

let selectedCard = (i) => {
  cards[i].classList.remove(`card--default`);
  cards[i].classList.add(`card--selected`);
  cards[i].classList.remove(`card--disabled`);
  cards[i].addEventListener(`mouseenter`, () => {
    cards[i].classList.add(`card--selected-hover`);
  });
  cards[i].addEventListener(`mouseleave`, () => {
    cards[i].classList.remove(`card--selected-hover`);
  });
}

let disabledCard = (i) => {
  cards[i].classList.remove(`card--default`);
  cards[i].classList.remove(`card--selected`);
  cards[i].classList.add(`card--disabled`);
}

let changeCard = (i) => {
  if (inputs[i].disabled) {
    inputs[i].disabled = true;
    disabledCard(i);
  }
  else if (inputs[i].checked) {
    inputs[i].checked = false;
    defaultCard(i);
  }
  else if(!inputs[i].checked) {
    inputs[i].checked = true;
    selectedCard(i);
  }
}

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener(`click`, () => changeCard(i));
  cards[i].addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === ENTER_KEYCODE) {
    changeCard(i);
    }
  });
  btns[i].addEventListener(`click`, (evt) => {
    evt.preventDefault();
    selectedCard(i);
  });
  btns[i].addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      selectedCard(i);
    }
  });

  if (inputs[i].disabled) {
    disabledCard(i);
  }
  else if(inputs[i].checked) {
    selectedCard(i);
  }
  else if (!inputs[i].checked) {
    defaultCard(i);
  }
}
