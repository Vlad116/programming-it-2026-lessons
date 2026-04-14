import templateProjectCard from './templateProjectCard.pug';

document.getElementById('app').innerHTML = templateProjectCard({
  title: 'Тестовый проект',
  description: "Пример с pug",
  image: '',
});