import { fakeProjectsApi, MIN_SEARCH_LENGTH } from "./fakeApi.js";

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
const searchInput = document.getElementById("search-input");

let currentSearchQuery = "";
let isLoading = true;
let projects;

const createProjectCard = (project) => {
  const cardContainder = document.createElement("div");
  cardContainder.className = "card";
  cardContainder.dataset.id = project.id;

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

const renderProjects = (projects) => {
  projectsListContainer.innerHTML = ""; // Очищаем список перед рендером
  projects.forEach((project) => createProjectCard(project));
};

const switchLoadingState = () => {
  if (isLoading) {
    loader.classList.remove("hidden");
    projectsListContainer.classList.add("hidden");
  } else {
    loader.classList.add("hidden");
    projectsListContainer.classList.remove("hidden");
  }
};

async function loadProjects(search = "") {
  // 1. Обработка промисов, await и try catch блок
  //   try {
  //     let data = await fakeProjectsApi.getProjects({});
  //   data.projects.forEach((value) => {
  //     createProjectCard(value);
  //   });
  //   } catch (err) {
  //     console.error("Ошибка async запроса:", err.message);
  //   }

  // 2. Обработка результата, через цепочку промисов

  isLoading = true;
  switchLoadingState();

  let currentData;

  await fakeProjectsApi
    .getProjects({
      search,
      limit: 10,
    })
    .then((data) => {
      currentData = [...data.projects];
      renderProjects(data.projects);
    })
    .catch((e) => {
      console.error("Ошибка async запроса:", e.message);
    })
    .finally(() => {
      isLoading = false;
      switchLoadingState();
    });

  return currentData;
}

const deleteCardFromDOM = async (event) => {
  const target = event.target;

  if (target.classList.contains("delete-btn")) {
    const card = target.closest(".card");
    const projectId = card.dataset.id;

    if (card && projectId !== undefined) {
      await fakeProjectsApi
        .deleteProject(projectId)
        .then(({ success, message }) => {
          if (success) {
            card.remove();
          }

          console.log(message);
        })
        .catch((e) => console.error(e));
    }
  }

  event.stopPropagation();
};

let timeotId = null;

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (timeotId) clearTimeout(timeotId);

  timeotId = setTimeout(() => {
    currentSearchQuery = value;
    loadProjects(value);
  }, 400);
});

projectsListContainer.addEventListener("click", deleteCardFromDOM);

async function init() {
  await loadProjects().then((data) => {
    projects = [...data];
  });
}

init();
