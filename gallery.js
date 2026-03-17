let likeCounter = 0;

// Элементы со страницы
const gallery = document.getElementById("gallery");
const likesTotal = document.getElementById("likes-counter");
const addBtn = document.getElementById("add-card");

// Вполне вероятно у вас не загрузятся картинки с picsum.photos без VPN подключения (не заметил когда изначально выбирал данный сервис)
const initialImages = [
  {
    id: 1,
    url: "https://picsum.photos/id/1015/600/400",
    title: "Вид на реку с горы",
  },
  {
    id: 2,
    url: "https://picsum.photos/id/201/600/400",
    title: "Ноутбук на столе",
  },
  { id: 3, url: "https://picsum.photos/id/29/600/400", title: "Вид на горы" },
  { id: 4, url: "https://picsum.photos/id/133/600/400", title: "Старые авто" },
  { id: 5, url: "https://picsum.photos/id/160/600/400", title: "Телефон" },
  {
    id: 6,
    url: "https://picsum.photos/id/202/600/400",
    title: "Дорога в лесу",
  },
];

// const showInModal = (event) => {
//   console.log("Показ в модальном окне крупной версии изображения");
// };

// Функция создания одной карточки
const createCard = (image) => {
  const cardContainder = document.createElement("div");
  cardContainder.className = "card";
  //   cardContainder.addEventListener("click", showInModal);

  const cardTitle = document.createElement("h3");
  cardTitle.innerText = image.title;

  const cardImage = document.createElement("img");

  cardImage.src = image.url;
  cardImage.alt = image.title;
  cardImage.id = String(image.id);

  const infoBlock = document.createElement("div");
  infoBlock.className = "info";

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerText = "❤️ Лайк";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerText = "❌ Удалить";

  infoBlock.append(cardTitle, likeBtn, deleteBtn);
  cardContainder.append(cardImage, infoBlock);

  gallery.appendChild(cardContainder);
};

// Инициализация стартовых карточек
initialImages.forEach(createCard);

const getRandomImageId = () => Math.floor(Math.random() * 300) + 100;

const addImage = () => {
  const randomImageId = getRandomImageId();

  console.log(randomImageId);
  createCard({
    id: Date.now(),
    url: `https://picsum.photos/id/${randomImageId}/600/400`,
    title: `Новое фото ${gallery.children.length + 1}`,
  });
};

addBtn.addEventListener("click", addImage);

const likeCard = (event) => {
  const target = event.target;

  if (target.classList.contains("like-btn")) {
    const isLiked = target.dataset.liked === "true";

    if (!isLiked) {
      target.textContent = "❤️ Лайкнуто";
      target.classList.add("liked");
      target.dataset.liked = "true";
      likeCounter++;
    } else {
      target.textContent = "❤️ Лайк";
      target.classList.remove("liked");
      target.dataset.liked = "false";
      likeCounter = Math.max(0, likeCounter - 1);
    }

    likesTotal.textContent = likeCounter;
  }
  event.stopPropagation();
};

const deleteCard = (event) => {
  const target = event.target;

  if (target.classList.contains("delete-btn")) {
    const card = target.closest(".card");

    if (card) {
      const likeBtn = card.querySelector(".like-btn");

      if (likeBtn && likeBtn.dataset.liked === "true") {
        likeCounter = Math.max(0, likeCounter - 1);
        likesTotal.textContent = likeCounter;
      }

      card.remove();
    }
  }
  event.stopPropagation();
};

/* 
────────────────────────────────────────────────
     ДЕЛЕГИРОВАНИЕ СОБЫТИЙ 
──────────────────────────────────────────────── 
*/
gallery.addEventListener("click", likeCard);
gallery.addEventListener("click", deleteCard);
