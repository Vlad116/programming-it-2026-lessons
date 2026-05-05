import { validateRequestBody } from "../utils/index.js";
import {
  findProjects,
  findProjectById,
  saveProject,
  upsertProject,
  removeProject,
} from "../repositories/index.js";

const CATEGORIES = [
  "E-commerce",
  "Dashboard",
  "Social",
  "Productivity",
  "Landing",
  "Other",
];

export const getProjects = async (req, res) => {
  const { search = "", page = "1", limit = "10", category = "all" } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const data = findProjects({
    search,
    category,
    page: pageNum,
    limit: limitNum,
  });

  // res.set("X-Total-Count", String(data.total));
  // res.json(data);
  res.render("projects/index", {
    title: "Проекты",
    projects: data.projects,
    total: data.total,
    totalPages: Math.ceil(data.total / limit),
    page: pageNum,
    search,
    category,
    categories: CATEGORIES,
    user: req.user ?? null,
  });
};

export const getProjectById = async (req, res) => {
  const projectId = parseInt(req.params.id);

  const project = findProjectById(projectId);

  if (!project)
    return res.status(404).json({ error: `Проект с id: ${id} не найден` });

  res.json(project);
};

export const createProject = async (req, res) => {
  const { title } = req.body;

  validateRequestBody(req.body, requiredProjectFields);

  const newProject = saveProject(req.body);

  res.status(201).json({
    success: true,
    message: `Проект ${title.trim()} успешно записан`,
    project: newProject,
  });
};

export const updateProject = async (req, res) => {
  const projectId = parseInt(req.params.id);

  validateRequestBody(req.body, requiredProjectFields);

  const updatedProject = upsertProject(projectId, req.body);

  if (!updatedProject) {
    return res.status(404).json({ error: `Проект '${projectId}' не найден` });
  }

  res.json({
    success: true,
    message: `Проект '${projectId}' успешно обновлен`,
    project: updatedProject,
  });
};

export const deleteProject = async (req, res) => {
  const projectId = parseInt(req.params.id);
  const deleted = removeProject(projectId);

  if (!deleted) {
    return res.status(404).json({ error: `Проект '${projectId}' не найден` });
  }

  res.json({
    success: true,
    message: `Проект '${deleted.title}' успешно удалён`,
    deletedId: deleted.id,
  });
};
