// Синтаксис до ES5

// function PortfolioProject(title, description, category) {
//   this._id = Date.now();
//   this._createdAt = new Date();
//   this.title = title;
//   this.description = description;
//   this.category = category;
// }

// PortfolioProject.prototype.render = function () {
//   console.log(`Рендерим проект ${this.title}`);
// };

// PortfolioProject.prototype.add = function () {
//   console.log(`Добавили ${this._id}`);
// };

// PortfolioProject.prototype.delete = function () {
//   console.log(`Удаляем проект ${this._id}`);
// };

// PortfolioProject.prototype.getId = function () {
//   return this._id;
// };

// PortfolioProject.prototype.getCreatedAt = function () {
//   return this._createdAt.toLocaleDateString("ru-RU");
// };

// function LandingProject(title, description, landingUrl) {
//   PortfolioProject.call(this, title, description, "Landing");
// }

// LandingProject.prototype = Object.create(PortfolioProject.prototype);
// LandingProject.prototype.constructor = LandingProject;

// LandingProject.prototype.render = function () {
//   PortfolioProject.prototype.render.call(this); // вызов метода родителя
//   console.log("-> Одностраничный рекламный лендинг");
// };

// LandingProject.prototype.openLink = function () {
//   if (this.landingUrl) {
//     window.open(this.landingUrl);
//   }
// };

// const projectsOld = [
//   new PortfolioProject(
//     "Социальная сеть для фотографов",
//     "Платформа для публикации фото с лайками, комментариями и подписками",
//     "Social",
//   ),
//   new LandingProject(
//     "Лендинг для кофейни «Bean & Brew»",
//     "Стильный одностраничный сайт с анимациями и формой онлайн-заказа",
//     "https://beanandbrewcoffee.com/",
//   ),
// ];

// projectsOld.forEach((project) => {
//   project.render(); // Полиморфизм в действии
// });

// Современный синтаксис классов в JS
/* 
  Абстракция — это когда мы скрываем сложную реализацию и показываем только необходимый интерфейс
  В JS абстракция реализуется через:

  Классы и методы
  Сокрытие деталей реализации»
*/
class PortfolioProject {
  /*
    «Инкапсуляция — это сокрытие внутреннего состояния объекта и предоставление доступа только через методы.
    В JS настоящей приватности раньше не было (только хак через «Замыкания»). Сейчас есть #приватные поля.» 
  */
  #id;
  #createdAt;

  constructor(title, description) {
    this.#id = Date.now();
    this.#createdAt = new Date();
    this.title = title;
    this.description = description;
  }

  getId() {
    return this.#id;
  }

  getCreatedDate() {
    return this.#createdAt.toLocaleDateString("ru-RU");
  }

  render() {
    console.log(`Рендерим проект ${this.title}`);
  }

  add() {
    console.log(`Добавили ${this.#id}`);
  }

  delete() {
    console.log(`Удаляем проект ${this.#id}`);
  }
}

// «Наследование — возможность создавать новый класс на основе существующего.»
class LandingProject extends PortfolioProject {
  constructor(title, description, projectUrl) {
    super(title, description, "Landing");
    this.projectUrl = projectUrl;
  }

  render() {
    super.render();
    console.log(
      `-> Одностраничный рекламный лендинг, link: ${this.projectUrl}`,
    );
  }

  openLink() {
    if (this.projectUrl) {
      window.open(this.projectUrl);
    }
  }
}

class EcommerceProject extends PortfolioProject {
  #usersCount;

  constructor(title, description, projectUrl, usersCount) {
    super(title, description, "Ecommerce");
    this.projectUrl = projectUrl;
    this.#usersCount = usersCount;
  }

  render() {
    super.render();
    console.log(
      `-> Проект интернет магазина, активных пользователей: ${this.#usersCount}`,
    );
  }

  openLink() {
    if (this.projectUrl) {
      window.open(this.projectUrl);
    }
  }
}

class DashboardProject extends PortfolioProject {
  constructor(title, description, techStack) {
    super(title, description, "Ecommerce");
    this.techStack = techStack;
  }

  render() {
    super.render();
    console.log(
      `-> Проект аналитического дашборда, технологический стэк: ${this.techStack}`,
    );
  }

  openLink() {
    if (this.landingUrl) {
      window.open(this.landingUrl);
    }
  }
}

/* 
  «Полиморфизм — способность объектов с одним интерфейсом вести себя по-разному.»
  т.е. мы можем подставлять к списку базовых классов его наследников (которые его расширяют)
*/
const projects = [
  new PortfolioProject(
    "Социальная сеть для фотографов",
    "Платформа для публикации фото с лайками, комментариями и подписками",
    "Social",
  ),
  new LandingProject(
    "Лендинг для кофейни «Bean & Brew»",
    "Стильный одностраничный сайт с анимациями и формой онлайн-заказа",
    "https://beanandbrewcoffee.com/",
  ),
  new EcommerceProject(
    "Интернет-магазин электроники",
    "Современный магазин с корзиной, фильтрами и адаптивной вёрсткой",
    "https://www.mvideo.ru/",
    1000000,
  ),
  new DashboardProject(
    "Аналитический дашборд",
    "Инструмент для анализа данных и визуализации результатов",
    ["Vue 3", "Chart.js", "Pinia"],
  ),
];

/*
  В большинстве случаев значение this определяется тем, каким образом вызвана функция.
  this — это не переменная и не значение, которое можно присвоить.
  this — это специальное значение, которое JavaScript автоматически подставляет в функцию в момент её вызова.

    Важно понимать:

  this не хранится внутри функции при её объявлении.
  this определяется заново каждый раз, когда функцию вызывают.
  JavaScript смотрит как именно вызвали функцию и на основе этого решает, на что будет указывать this.
*/
console.log(this);

projects.forEach((project) => {
  project.render(); // Полиморфизм в действии
});

const project = {
  title: "Лендинг кофейни",
  category: "Landing",

  showInfo() {
    console.log(`Текущие данные проекта: ${this.title} (${this.category})`);
  },
};

project.showInfo(); // все гуд

setTimeout(project.showInfo, 1000); // undefined undefined, контекст потерян

// Варианты привязки контекста функции

// Вариант 1 — bind()
setTimeout(project.showInfo.bind(project), 1000); // привязываем конктест к функции в явновном виде

// Вариант 2 — стрелочная функция (очень часто используется в классах)

// const project = {
//   title: "Лендинг кофейни",
//   category: "Landing",

//   showInfo: () => {
//     console.log(`Текущие данные проекта: ${this.title} (${this.category})`);
//   },
// };

setTimeout(project.showInfo, 1000, project);

const project2 = {
  title: "Дашборд-аналитики",
  category: "Dashboard",
};

function showInfoAlert(firstPart, lastPart) {
  alert(`Текущие данные проекта: ${this[firstPart]} (${this[lastPart]})`);
}

/* 
  Разница у call и apply, только в формате передачи аргументов функции 
*/
showInfoAlert.call(project2, "title", "category"); // взять метод одного объекта, в том числе встроенного, и вызвать в контексте другого.

// showInfoAlert.apply(project2, ["title", "category"]); // взять метод одного объекта, в том числе встроенного, и вызвать в контексте другого.
