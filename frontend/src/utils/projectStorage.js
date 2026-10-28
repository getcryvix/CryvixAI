export function saveProject(project) {
  localStorage.setItem(
    "cryvixai-project",
    JSON.stringify(project)
  );
}

export function loadProject() {
  const data = localStorage.getItem("cryvixai-project");

  if (!data) return null;

  return JSON.parse(data);
}

export function clearProject() {
  localStorage.removeItem("cryvixai-project");
}