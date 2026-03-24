import { fakeProjectsApi } from "./fakeApi.js";

// Структура объекта записи о проекте
//   {
//     id: 1,
//     title: "Интернет-магазин электроники",
//     description:
//       "Современный магазин с корзиной, фильтрами и адаптивной вёрсткой на React + Tailwind",
//     image: "https://picsum.photos/id/1015/600/400",
//     category: "E-commerce",
//     year: 2025,
//     tags: ["React", "Tailwind", "Redux"],
//   }

const projectsListContainer = document.getElementById("projects-list");
const loader = document.getElementById("loader");

const createProjectCard = (project) => {
  const cardContainder = document.createElement("div");
  cardContainder.className = "card";
  //   cardContainder.addEventListener("click", showInModal);

  const cardTitle = document.createElement("h3");
  cardTitle.innerText = project.title;

  const cardDescription = document.createElement("p");
  cardDescription.innerText = project.description;

  const cardImage = document.createElement("img");

  cardImage.src = project.image;
  cardImage.alt = project.title;
  cardImage.id = String(project.id);

  const projectTagsContainer = document.createElement("div");
  projectTagsContainer.className = "project-tags-container";

  const projectTags = project.tags.map((value) => {
    const tagElement = document.createElement("span");
    tagElement.className = "project-tag";
    tagElement.textContent = value;

    return tagElement;
  });

  projectTagsContainer.append(...projectTags);

  const infoBlock = document.createElement("div");
  infoBlock.className = "info";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerText = "❌ Удалить";

  infoBlock.append(cardTitle, cardDescription, projectTagsContainer, deleteBtn);
  cardContainder.append(cardImage, infoBlock);

  projectsListContainer.appendChild(cardContainder);
};

const renderProjects = (projects) =>
  projects.forEach((project) => createProjectCard(project));

async function init() {
  // 1. Обработка промисов, await и try catch блок
  //   try {
  //     let data = await fakeProjectsApi.getProjects({});
  //   data.projects.forEach((value) => {
  //     createProjectCard(value);
  //   });
  //   } catch (err) {
  //     console.error("Ошибка async запроса:", err.message);
  //   }

  let isLoading = true;

  // 2. Обработка результата, через цепочку промисов
  fakeProjectsApi
    .getProjects({})
    .then((data) => {
      renderProjects(data.projects);
    })
    .catch((e) => {
      console.error("Ошибка async запроса:", err.message);
    })
    .finally(() => {
      isLoading = false;
      console.log(isLoading);
      loader.classList.add("hidden");
    });
}

init();
