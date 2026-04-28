import { projectsApi } from "./http-requests.js";

(async () => {
  projectsApi.getProjects().then((data) => console.log(data.projects));
})();
