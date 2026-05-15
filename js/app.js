import {
  renderProjects,
  createProject,
  setCurrentProject,
  renderButtons,
  createButton,
  toggleViewMode,
  renderTrustBin
} from "./projects.js";

const dashboardScreen = document.getElementById("dashboardScreen");
const projectsTabScreen = document.getElementById("projectsTabScreen");
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
document.getElementById("projectsTabCreateBtn")?.addEventListener("click", createProject);

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

/* BOTTOM NAV */
const navDashboard = document.getElementById("navDashboard");
const navProjects = document.getElementById("navProjects");
const navNotes = document.getElementById("navNotes");
const navWorkspace = document.getElementById("navWorkspace");
const navTrash = document.getElementById("navTrash");

function setActiveNav(activeBtn){
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  activeBtn.classList.add("active");
}

navDashboard?.addEventListener("click", ()=>{
  showScreen(dashboardScreen);
  setActiveNav(navDashboard);
});

navProjects?.addEventListener("click", ()=>{
  renderProjects("", "projectsTabGrid");
  showScreen(projectsTabScreen);
  setActiveNav(navProjects);
});

navNotes?.addEventListener("click", ()=>{
  showScreen(document.getElementById("notesScreen"));
  setActiveNav(navNotes);
});

navWorkspace?.addEventListener("click", ()=>{
  showScreen(document.getElementById("ideScreen"));
  setActiveNav(navWorkspace);
});

navTrash?.addEventListener("click", ()=>{
  renderTrustBin();
  showScreen(document.getElementById("trustBinScreen"));
  setActiveNav(navTrash);
});
document.getElementById("projectsTabSearch")?.addEventListener("input",(e)=>{
  renderProjects(e.target.value, "projectsTabGrid");
});

renderProjects();