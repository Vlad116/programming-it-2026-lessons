let name: string = 'Ivan';
let age: number = 20;
let isAdmin: boolean = true;
let skills: string[] = ['JavaScript', 'TypeScript'];
let projects: number[] = [1, 2, 3];

// Кортеж (tuple) — массив с фиксированной длиной и типами
let userInfo: [string, number, boolean] = ['Ivan', 20, true];

type Theme = "light" | "dark";

// enum ThemeEnum {
//     Light = "light",
//     Dark = "dark",
// }

//  Union type
let theme: Theme = "light";
// let themeEnumValue: ThemeEnum = ThemeEnum.Dark;

// Any — отключает проверку типов (использовать только когда совсем нет выбора)
let anything: any = 42; // TS не проверяет тип для данной переменной

// Unknown - безопасная альтернатива any
let unknownValue: unknown = "строка";

type TProjectCategory = "E-commerce" | "Landing" | "Dashboard" | "Productivity"

interface IProject {
    id: number;
    title: string;
    description: string;
    image: string;
    category: TProjectCategory;
    year: number;
    tags?: string[];
}

type TContactFormData = {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

const myProject: IProject = {
    id: 1,
    title: "Интернет-магазин электроники",
    description:
      "Современный магазин с корзиной, фильтрами и адаптивной вёрсткой на React + Tailwind",
    image: "https://picsum.photos/id/1015/600/400",
    category: "E-commerce",
    year: 2025,
    tags: ["React", "Tailwind", "Redux"],
};

interface IEcommerceProject extends IProject {
    projectUrl: string,
}

interface IPortfolioProject {
    id?: number;
    createdAt?: Date;
    title: string;
    description: string;
    render(): void;
    add(): void;
    delete(): void;
}

class PortfolioProject implements IPortfolioProject {
  /*
    «Инкапсуляция — это сокрытие внутреннего состояния объекта и предоставление доступа только через методы.
    В JS настоящей приватности раньше не было (только хак через «Замыкания»). Сейчас есть #приватные поля.» 
  */
  private _id;
  private _createdAt; // доступно только внутри самого класса
  title: string; // public - по умолчанию
  description: string;

  constructor(title: string, description: string) {
    this._id = Date.now();
    this._createdAt = new Date();
    this.title = title;
    this.description = description;
  }

  get id(): number {
    return this._id;
  }

  // protected - доступно внутри класса и его наследниках
  protected getCreatedDate() {
    return this._createdAt.toLocaleDateString("ru-RU");
  }

  render() {
    console.log(`Рендерим проект ${this.title}`);
  }

  add() {
    console.log(`Добавили ${this._id}`);
  }

  delete() {
    console.log(`Удаляем проект ${this._id}`);
  }
}

// class LandingProject extends PortfolioProject {
//   constructor(title, description, projectUrl) {
//     super(title, description, "Landing");
//     this.projectUrl = projectUrl;
//   }

//   render() {
//     super.render();
//     console.log(
//       `-> Одностраничный рекламный лендинг, link: ${this.projectUrl}`,
//     );
//   }

//   openLink() {
//     if (this.projectUrl) {
//       window.open(this.projectUrl);
//     }
//   }
// }

// Generic функция
function filterByPropery<T, K extends keyof T>(
    items: T[],
    key: K,
    value: T[K],
): T[] {
    return items.filter((item) => item[key] === value);
};

const projectsDB: IProject[] = [
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

const filteredByCategory = filterByPropery(projectsDB, "category", "Productivity");
console.log(filteredByCategory);
const filteredByYear = filterByPropery(projectsDB, "year", 2025);
console.log(filteredByYear);

// Generic интерфейс
interface ApiResponse<T> {
    data: T[];
    success: boolean;
    error?: string;
}

type ProjectsResponse = ApiResponse<IProject>;

type TProjectUpdate = Partial<IProject>; // Partial<T> — делает все поля необязательными

const updateData: TProjectUpdate = {
    title: "Новое название",
}

type TProjectPreview = Pick<IProject, "title" | "year" | "image">; // Pick<T, K> — выбирает поля из T по списку K

// interface ProjectPreview {
//     title: string;
//     year: number;
//     image: string;
// }

type TProjectWithoutId = Omit<IProject, "id">; // Omit<T, K> — удаляет поля из T по списку K

type ReadonlyProject = Readonly<IProject>; // Readonly<T> — делает все поля readonly

type ImmutableProject = Readonly<TProjectWithoutId>

type TProjectPartialUpdate = Partial<TProjectWithoutId>

const objectsByNameMap = new Map<string, Record<string, unknown>>();
