let tasks = [];

// добавление элемента в конец массива
tasks.push("Вынести мусор");

// удаление элемента с конца массива
tasks.push(null);
let lastElement = tasks.pop();

// Object
let user = {
  name: "",
  tasks: [],
  age: 0,
};

// Обращение к свойству объекта,
console.log(user.name);
console.log(user["name"]);
console.log("Вывод списка ключей: ", Object.keys(user));
console.log("Вывод списка значений: ", Object.values(user));
console.log("Вывод списка пар ключ - значение: ", Object.entries(user));

user.age = 28;

// Удаление свойства объекта
// console.log(user.keyToDelete);
// delete user.keyToDelete;
// console.log(user.keyToDelete);

user.tasks.push("Вынести мусор");
console.log(user);

/* 
    Функция - блок кода, который можно вызывать многократно по имени. 
    Принимает параметры (может быть без параметров), делает что-то, может вернуть результат (return). Без return — undefined. 
    Функции изолируют код, делают его переиспользуемым.
*/

// addTask("Задача1");

// Function Declaration (hoisting - вызов работает до объявления функции)
// function addTask(task) {
//   if (task == null) return "Пользователь отменил ввод";

//   user.tasks.push(task);

//   return user.tasks;
// }

/*
    Задача 1: ToDo-менеджер сообщений в CLI (Command-Line interface)
    Реализовать добавление элементов в список задач в поле tasks объекта user, со вводом от пользователя
    - propmt() - для ввода данных
    - alert() - для вывода ошибок
    - console.log() - для вывода данных
    Ввести данные → валидация (если null или введена пустая строка — ошибка) → добавить введенную строку в список задач, вывести список. 
    Corner case: Отмена prompt (при null)
*/

// Function Expression (нет hoisting)
// Хелпер функция (вспомогательная), для парсинга числа в поле age
const parseAge = function (age) {
  const parsingError = "Необходимо ввести число!";

  if (Number.isNaN(age)) {
    alert(parsingError);
    return;
  }

  return age;
};

// Инициализация данных объекта user
const initData = function () {
  let inputName = prompt("Имя:")?.trim() || "Default Name";
  user.name = inputName;

  let inputAge = Number(prompt("Возраст:")?.trim());
  let parsedAge = parseAge(inputAge);

  if (typeof parsedAge === "number") {
    user.age = parsedAge;
  }
};

// Arrow Function
const validateTaskInput = (task) => {
  return typeof task === "string" && task.length > 0; // проверка ввода пользователя
};

// Функция для добавления задачи
const addTask = function () {
  let taskFromUser = prompt("Введите задачу:");
  let error = "";

  if (taskFromUser == null) {
    error = "Пользователь отменил ввод";
  }

  if (!validateTaskInput(taskFromUser)) {
    error = "Пустая строка";
  }

  if (error) {
    alert(error);
    return;
  }

  user.tasks.push(taskFromUser);

  return user.tasks;
};

// Функция вывода списка задач
const renderTasks = function () {
  console.log("Список задач:");
  user.tasks.forEach((value, index) => console.log(`${index + 1}. ${value}`));
};

initData();

// Бесконечный цикл для ввода от пользователя, пока не будет явно прерван цикл пользователем
while (true) {
  const result = addTask();

  if (result === "undefined") {
    continue; // переход к следующей итерации, если в процессе выполнения addTask возникла ошибка и функция вернула undefined
  }

  console.log("Значение успешно добавлено!");
  renderTasks();

  if (prompt("Продолжить добавление? (y/n)") !== "y") break; // прерывание цикла
}
