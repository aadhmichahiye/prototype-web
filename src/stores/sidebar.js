import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    width: window.innerWidth,
    isDesktop: window.innerWidth >= 1024,
    desktopExpanded: true, // expanded/collapsed state on desktop
    mobileOpen: false, // open/close state on mobile
  }),

  actions: {
    toggle() {
      console.log("toggle action triggered");
      if (this.isDesktop) {
        this.desktopExpanded = !this.desktopExpanded;
      } else {
        this.mobileOpen = !this.mobileOpen;
      }
    },

    closeMobile() {
      this.mobileOpen = false;
    },

    handleResize() {
      this.width = window.innerWidth;
      this.isDesktop = this.width >= 1024;

      if (this.isDesktop) {
        this.mobileOpen = false; // always close mobile if desktop
      }
    },
  },
});
