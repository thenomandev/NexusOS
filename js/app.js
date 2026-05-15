import {
  renderProjects,
  createProject,
  setCurrentProject,
  renderButtons,
  createButton,
  toggleViewMode
} from "./projects.js";

const dashboardScreen = document.getElementById("dashboardScreen");
const projectScreen = document.getElementById("projectScreen");
const viewerScreen = document.getElementById("viewerScreen");

const drawer = document.getElementById("sideDrawer");
const overlay = document.getElementById("drawerOverlay");
const viewerFrame = document.getElementById("viewerFrame");

function showScreen(screen){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  screen.classList.add("active");
}

export function openProject(projectId){
  setCurrentProject(projectId);
  renderButtons();
  showScreen(projectScreen);
}

export function openViewer(url){
  viewerFrame.src = url;
  showScreen(viewerScreen);
}

document.getElementById("menuBtn")?.addEventListener("click", ()=>{
  drawer.classList.add("active");
  overlay.classList.add("active");
});

overlay?.addEventListener("click", ()=>{
  drawer.classList.remove("active");
  overlay.classList.remove("active");
});

document.getElementById("quickCreateBtn")?.addEventListener("click", createProject);
document.getElementById("drawerCreateProject")?.addEventListener("click", createProject);

document.getElementById("projectBackBtn")?.addEventListener("click", ()=>{
  showScreen(dashboardScreen);
});

document.getElementById("viewerBackBtn")?.addEventListener("click", ()=>{
  showScreen(projectScreen);
});

document.getElementById("toggleViewBtn")?.addEventListener("click", toggleViewMode);
document.getElementById("addButtonBtn")?.addEventListener("click", createButton);

document.getElementById("projectSearch")?.addEventListener("input",(e)=>{
  renderProjects(e.target.value);
});

document.getElementById("viewerMenuBtn")?.addEventListener("click", ()=>{
  window.open(viewerFrame.src, "_blank");
});

renderProjects();