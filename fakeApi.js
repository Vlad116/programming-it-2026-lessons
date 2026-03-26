const projectsDB = [
  {
    id: 1,
    title: "Интернет-магазин электроники",
    description:
      "Современный магазин с корзиной, фильтрами и адаптивной вёрсткой на React + Tailwind",
    image: "https://picsum.photos/id/1015/600/400",
    category: "E-commerce",
    year: 2025,
    tags: ["React", "Tailwind", "Redux"],
  },
  {
    id: 2,
    title: "Дашборд аналитики продаж",
    description:
      "Интерактивный дашборд с графиками, фильтрами и экспортом данных",
    image: "https://picsum.photos/id/201/600/400",
    category: "Dashboard",
    year: 2025,
    tags: ["Vue 3", "Chart.js", "Pinia"],
  },
  {
    id: 3,
    title: "Социальная сеть для фотографов",
    description:
      "Платформа для публикации фото с лайками, комментариями и подписками",
    image: "https://picsum.photos/id/133/600/400",
    category: "Social",
    year: 2024,
    tags: ["React", "Firebase", "Tailwind"],
  },
  {
    id: 4,
    title: "Трекер привычек и продуктивности",
    description: "Приложение с календарем, статистикой и напоминаниями",
    image: "https://picsum.photos/id/160/600/400",
    category: "Productivity",
    year: 2025,
    tags: ["Next.js", "TypeScript", "Prisma"],
  },
  {
    id: 5,
    title: "Лендинг для кофейни «Bean & Brew»",
    description:
      "Стильный одностраничный сайт с анимациями и формой онлайн-заказа",
    image: "https://picsum.photos/id/29/600/400",
    category: "Landing",
    year: 2024,
    tags: ["HTML", "CSS", "GSAP"],
  },
  {
    id: 6,
    title: "Кино-поисковик FilmFinder",
    description: "Поиск фильмов и сериалов с трейлерами и рейтингами",
    image: "https://picsum.photos/id/201/600/400",
    category: "Entertainment",
    year: 2025,
    tags: ["React", "TMDB", "Framer Motion"],
  },
  {
    id: 7,
    title: "Система управления задачами TaskFlow",
    description: "Kanban-доска с drag & drop, комментариями и уведомлениями",
    image: "https://picsum.photos/id/133/600/400",
    category: "Productivity",
    year: 2025,
    tags: ["Vue 3", "Pinia", "Dragula"],
  },
  {
    id: 8,
    title: "Портфолио веб-разработчика",
    description:
      "Многостраничное портфолио с блогом, контактной формой и тёмной темой",
    image: "https://picsum.photos/id/1015/600/400",
    category: "Portfolio",
    year: 2024,
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: 9,
    title: "Приложение для онлайн-бронирования столиков",
    description: "Система резервации в ресторанах с реал-тайм обновлением",
    image: "https://picsum.photos/id/251/600/400",
    category: "Booking",
    year: 2025,
    tags: ["React", "Socket.io", "Tailwind"],
  },
  {
    id: 10,
    title: "Фитнес-трекер с планами тренировок",
    description: "Приложение для отслеживания тренировок и прогресса",
    image: "https://picsum.photos/id/180/600/400",
    category: "Health",
    year: 2025,
    tags: ["React Native", "Firebase"],
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MIN_SEARCH_LENGTH = 3;

export const fakeProjectsApi = {
  async getProjects({
    page = 1,
    limit = 5,
    search = "",
    category = "all",
  } = {}) {
    await delay(1000); // имитация загрузки

    let filtered = [...projectsDB];

    // фильтрация по поиску
    if (!!search && search.length >= MIN_SEARCH_LENGTH) {
      const searchQuery = search.toLowerCase().trim();

      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery) ||
          project.description.toLowerCase().includes(searchQuery),
      );
    }

    return {
      projects: filtered,
    };
  },

  async addProject(projectData) {
    const newProject = {
      id: projectsDB.length + 1,
      title: projectData.title,
      description: projectData.description || "",
      image: projectData.image,
      category: projectData.category || "Other",
      year: projectData.year || new Date().getFullYear(),
      tags: Array.isArray(projectData.tags) ? projectData.tags : [],
    };

    projectsDB.push(newProject);
    // projectsDB.unshift(newProject); - если бы хотели добавлять в начало списка

    return {
      success: true,
      message: "Проект успешно добавлен",
      project: newProject,
    };
  },

  async deleteProject(id) {
    const index = projectsDB.findIndex((project) => String(project.id) === id);

    if (index === -1) {
      throw new Error(`Проект с id ${id} не найден`);
    }

    const deletedProject = projectsDB.splice(index, 1)[0];

    return {
      success: true,
      message: `Проект "${deletedProject.title}" успешно удалён`,
      deletedId: id,
    };
  },
};
