import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  function createProject() {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: description.trim(),
    };

    setProjects((prev) => [newProject, ...prev]);

    setProjectName("");
    setDescription("");
    setShowCreate(false);
  }

  function deleteProject(id) {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  }

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              My Workspace
            </h1>

            <p className="text-zinc-400 mt-2">
              Organize your AI work into projects.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-semibold transition"
          >
            + New Project
          </button>

        </div>

        {/* CREATE PROJECT */}
        {showCreate && (
          <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-5">
              Create New Project
            </h2>

            <input
              type="text"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              placeholder="Project name"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-cyan-500"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Short description (optional)"
              className="mt-4 w-full h-28 bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none resize-none focus:border-cyan-500"
            />

            <div className="flex gap-3 mt-5">

              <button
                onClick={createProject}
                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold"
              >
                Create Project
              </button>

              <button
                onClick={() => setShowCreate(false)}
                className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* EMPTY STATE */}
        {projects.length === 0 && !showCreate && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📁
            </div>

            <h2 className="text-2xl font-bold">
              No projects yet
            </h2>

            <p className="text-zinc-400 mt-2 mb-6">
              Create your first project to organize your AI work.
            </p>

            <button
              onClick={() => setShowCreate(true)}
              className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-semibold"
            >
              + Create Your First Project
            </button>

          </div>
        )}

        {/* PROJECT GRID */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/50 transition"
              >

                <div className="text-3xl mb-4">
                  📁
                </div>

                <h2 className="text-xl font-bold">
                  {project.name}
                </h2>

                <p className="text-zinc-400 text-sm mt-2 min-h-[40px]">
                  {project.description ||
                    "No description added."}
                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-semibold"
                  >
                    Open
                  </button>

                  <button
                    onClick={() =>
                      deleteProject(project.id)
                    }
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}