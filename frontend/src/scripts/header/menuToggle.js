function toggleMenu(elemento) {
  elemento.addEventListener("click", () => {
    const menu = document.getElementById("header-menu");

    if (menu.classList.contains("header-menu-oculto")) {
      menu.classList.remove("header-menu-oculto");
    } else {
      menu.classList.add("header-menu-oculto");
    }
  });
}

toggleMenu();
