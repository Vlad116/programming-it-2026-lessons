import { MIN_SEARCH_LENGTH, API_URL } from "./constants";

export const projectsApi = {
  async getProjects({
    page = 1,
    limit = 5,
    search = "",
    category = "all",
  } = {}) {
    const params = new URLSearchParams();

    params.set("_page", page);
    params.set("_limit", limit);

    // if (search && search.length >= MIN_SEARCH_LENGTH) {
    //   params.set("query", search);
    // }

    // if (category && category !== "all") {
    //   params.set("category", category);
    // }
    //
    const data = await fetch(`${API_URL}/projects`).then((response) =>
      response.json(),
    );

    return {
      projects: data,
    };
  },

  async addProject(projectData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Ошибка добавления ${response.status}`);
    }

    const createdProject = response.json();

    return {
      success: true,
      message: "Проект успешно добавлен",
      project: createdProject,
    };
  },

  async deleteProject(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Ошибка удаления: ${response.status}`);
    }

    return {
      success: true,
      message: `Проект "${deletedProject.title}" успешно удалён`,
      deletedId: id,
    };
  },
};
