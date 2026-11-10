(() => {
    const $ = (id) => document.getElementById(id);

    // Elementos da página
    const normalize = (value) => (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const searchInput = $("searchInput");
    const searchContainer = $("searchContainer");
    const searchToggle = $("searchToggle");
    const projectGrid = $("projectGrid");
    const sortSelect = $("sortSelect");
    const filterButtons = document.querySelectorAll(".filter");
    const emptyMessage = $("emptyMessage");

    let selectedFilter = "todos";

    // Toast criado dinamicamente para evitar dependência de markup extra.
    function toast(message) {
        let node = $("conectaToast");
        if (!node) {
            node = document.createElement("div");
            node.id = "conectaToast";
            node.className = "conecta-toast";
            node.setAttribute("role", "status");
            document.body.appendChild(node);
        }
        node.textContent = message;
        node.classList.add("show");
        clearTimeout(window.__conectaToastTimer);
        window.__conectaToastTimer = setTimeout(() => node.classList.remove("show"), 2500);
    }

    // Busca expansível
    if (searchToggle && searchContainer && searchInput) {
        searchToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const active = searchContainer.classList.contains("active");
            if (!active) {
                searchContainer.classList.add("active");
                searchToggle.setAttribute("aria-expanded", "true");
                searchInput.focus();
            } else if (!searchInput.value.trim()) {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            } else {
                updateProjects();
            }
        });

        searchInput.addEventListener("input", updateProjects);

        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target) && !searchInput.value.trim()) {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                searchInput.value = "";
                updateProjects();
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
                searchToggle.focus();
            }
        });
    }

    // Lista de projetos
    function updateProjects() {
        if (!projectGrid) return;
        const query = normalize(searchInput?.value);
        const cards = Array.from(projectGrid.querySelectorAll(".project-card"));
        let visible = 0;

        cards.forEach((card) => {
            const category = normalize(card.dataset.category);
            const content = normalize(card.textContent);
            const matchesCategory = selectedFilter === "todos" || category === selectedFilter;
            const matchesQuery = content.includes(query);
            const show = matchesCategory && matchesQuery;
            card.hidden = !show;
            card.style.display = show ? "" : "none";
            if (show) visible++;
        });

        if (emptyMessage) emptyMessage.style.display = visible ? "none" : "block";
        const resultCount = $("resultCount");
        if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? "resultado" : "resultados"}`;
    }

    // Filtros
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            selectedFilter = normalize(button.dataset.filter || "todos");
            updateProjects();
        });
    });

    // Ordenação
    if (sortSelect && projectGrid) {
        sortSelect.addEventListener("change", () => {
            const cards = Array.from(projectGrid.querySelectorAll(".project-card"));
            const type = sortSelect.value;
            cards.sort((a, b) => {
                if (type === "recentes" || type === "recent") {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (type === "antigos" || type === "old") {
                    return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                }
                if (type === "titulo" || type === "az") {
                    return normalize(a.querySelector("h3")?.textContent)
                        .localeCompare(normalize(b.querySelector("h3")?.textContent), "pt-BR");
                }
                return 0;
            });
            cards.forEach((card) => projectGrid.appendChild(card));
            updateProjects();
        });
    }

    // Notificações demonstrativas
    $("notifications")?.addEventListener("click", () => toast("Nenhuma notificação nova."));

    // Card links levam ao portfólio pessoal para ver os detalhes.
    projectGrid?.querySelectorAll(".project-card").forEach((card) => {
        card.querySelectorAll(".project-image, .project-footer a").forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = "perfil_pessoal.html#projetos";
            });
        });
    });

    updateProjects();
})();
