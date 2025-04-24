Vue.component("sidebar-close-icon", {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-panel-left-close-icon lucide-panel-left-close">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  `,
});

Vue.component("sidebar-open-icon", {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-panel-left-open-icon lucide-panel-left-open">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  `,
});

Vue.component("create-project-dialog", {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div class="dialog-container" v-if="isOpen">
      <dialog open class="project-dialog">

        <div class="dialog-header">
          <h2>Create New Project</h2>
          <button class="close-button" @click="closeDialog">×</button>
        </div>

        <div class="dialog-content">
          <form @submit.prevent="createProject">
            <div class="form-group">
              <label for="project-title">Project Title</label>
              <input type="text" id="project-title" v-model="projectTitle" placeholder="Enter project title" required>
            </div>
            <div class="dialog-actions">
              <button type="button" class="btn-cancel" @click="closeDialog">Cancel</button>
              <button type="submit" class="btn-create">Create</button>
            </div>
          </form>
        </div>

      </dialog>
    </div>
  `,
  data() {
    return {
      projectTitle: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    createProject() {
      if (this.projectTitle.trim()) {
        this.$emit("create-project", this.projectTitle);
        this.projectTitle = "";
        this.closeDialog();
      }
    },
  },
});

Vue.component("sidebar", {
  props: {
    sidebarOpen: {
      type: Boolean,
      required: true,
    },
    activeProject: {
      type: Object,
    },
    projects: {
      type: Array,
      required: true,
      default: [],
    },
  },
  template: `
    <aside :class="{ closed: !sidebarOpen }">
      
      <div class="sidebar-header" v-if="sidebarOpen">
        <h1>{{ title }}</h1>
        <button v-on:click="toggleSidebar">
          <sidebar-close-icon />
        </button>
      </div>

      <div class="sidebar-header-closed" v-if="!sidebarOpen">
        <button v-on:click="toggleSidebar">
          <sidebar-close-icon />
        </button>
      </div>

      <div class="sidebar-content" v-if="sidebarOpen">
        <h3>Projects</h3>
        <button v-for="(project, idx) in projects" :key="idx" v-on:click="updateProject(project.id)">
          {{ project.title }}
        </button>

        <button class="btn-create-project" @click="openCreateProjectDialog">
          Create project
        </button>
      </div>

    </aside>
  `,
  data() {
    return {
      title: "Kanban",
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    updateProject(id) {
      this.setActiveProject(id);
    },
    setActiveProject(id) {
      this.$emit("set-active-project", id);
    },
    openCreateProjectDialog() {
      this.$emit("open-create-project-dialog");
    },
  },
});

Vue.component("navbar", {
  props: {
    activeProject: {
      type: Object | null,
    },
  },
  template: `
    <nav :class="{ nocontent: !activeProject }">
      <h4 v-if="activeProject">{{ activeProject.title }}</h4>
      <button v-if="activeProject">
        Create Task
      </button>
    </nav>
  `,
});

Vue.component("main-content", {
  props: {
    activeProject: {
      type: Object | null,
    },
  },
  template: `
    <div class="main-content">
      <div>
        <div class="column" v-for="(status, idx) in activeProject.statuses" :key="idx">
          <h4>{{ status.name }} ({{ status.tasks.length }})</h4>

          <div class="tasks">
            <div v-for="(task, idx) in status.tasks" :key="idx" class="task-container">
              <h6>{{ task.title }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
});

const app = new Vue({
  el: "#app",
  data: {
    sidebarOpen: true,
    createProjectDialog: false,
    activeProject: null,
    projects: [
      {
        id: 1,
        title: "Alifshop backend",
        nextTaskId: 4,
        statuses: [
          {
            id: 1,
            name: "To Do",
            tasks: [
              {
                id: 1,
                title: "Write docker compose for psql",
              },
            ],
          },
          {
            id: 2,
            name: "Doing",
            tasks: [
              {
                id: 2,
                title: "Project architecture",
              },
            ],
          },
          {
            id: 3,
            name: "Done",
            tasks: [
              {
                id: 3,
                title: "Create git repository",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Simple Operating System",
        nextTaskId: 1,
        statuses: [
          {
            id: 1,
            name: "To Do",
            tasks: [],
          },
          {
            id: 2,
            name: "Doing",
            tasks: [],
          },
          {
            id: 3,
            name: "Done",
            tasks: [],
          },
        ],
      },
    ],
    nextProjectId: 3,
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    setActiveProject(id) {
      this.activeProject = this.projects.find((project) => project.id == id);
    },
    openCreateProjectDialog() {
      this.createProjectDialog = true;
    },
    closeCreateProjectDialog() {
      this.createProjectDialog = false;
    },
    createProject(title) {
      const newProject = {
        id: this.nextProjectId,
        title,
        nextTaskId: 1,
        statuses: [
          {
            id: 1,
            name: "To Do",
            tasks: [],
          },
          {
            id: 2,
            name: "Doing",
            tasks: [],
          },
          {
            id: 3,
            name: "Done",
            tasks: [],
          },
        ],
      };
      this.nextProjectId++;
      this.projects.push(newProject);
      this.setActiveProject(newProject.id);
    },
  },
});
