(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);

    // Auxiliares
    const normalize = (value) => (value || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    // Dados demonstrativos 
    const projects = [
        { title:"Identidade Visual", category:"Acadêmico", year:2026, area:"Comunicação", description:"Criação de sistema visual para uma marca fictícia.", skills:["Branding","Design gráfico"], tools:"Illustrator • Figma", cover:"cover-a" },
        { title:"Campanha Digital", category:"Profissional", year:2025, area:"Comunicação", description:"Planejamento de campanha para redes sociais.", skills:["Publicidade","Mídias sociais"], tools:"Photoshop • Canva", cover:"cover-b" },
        { title:"Projeto Audiovisual", category:"Acadêmico", year:2025, area:"Comunicação", description:"Conceito, roteiro e produção de vídeo.", skills:["Audiovisual","Produção"], tools:"Premiere • CapCut", cover:"cover-c" },
        { title:"Editorial", category:"Pessoal", year:2025, area:"Comunicação", description:"Exploração de composição e narrativa visual.", skills:["Design editorial","Tipografia"], tools:"InDesign • Photoshop", cover:"cover-d" },
        { title:"Fotografia Documental", category:"Acadêmico", year:2024, area:"Comunicação", description:"Ensaio visual sobre cotidiano e território.", skills:["Fotografia","Documental"], tools:"Lightroom • Camera", cover:"cover-e" },
        { title:"Ação de Comunicação", category:"Voluntário", year:2024, area:"Comunicação", description:"Materiais de divulgação para iniciativa social.", skills:["Comunicação","Impacto social"], tools:"Canva • Illustrator", cover:"cover-f" },
        { title:"Experiência de Marca", category:"Profissional", year:2024, area:"Comunicação", description:"Proposta de identidade e aplicações de marca.", skills:["Branding","Direção de arte"], tools:"Figma • Illustrator", cover:"cover-a" },
        { title:"Podcast Universitário", category:"Acadêmico", year:2024, area:"Comunicação", description:"Pesquisa, pauta e produção de conteúdo em áudio.", skills:["Áudio","Conteúdo"], tools:"Audition • Audacity", cover:"cover-b" },
        { title:"Projeto Integrador", category:"Acadêmico", year:2023, area:"Comunicação", description:"Solução de comunicação desenvolvida em equipe.", skills:["Estratégia","Campanha"], tools:"Figma • Photoshop", cover:"cover-c" },
        { title:"Campanha Social", category:"Profissional", year:2023, area:"Publicidade", description:"Desenvolvimento de peças para uma campanha de conscientização.", skills:["Publicidade","Design"], tools:"Photoshop • Canva", cover:"cover-d" },
        { title:"Narrativas Visuais", category:"Acadêmico", year:2023, area:"Audiovisual", description:"Estudo de linguagem visual e construção narrativa.", skills:["Roteiro","Narrativa"], tools:"Premiere • Figma", cover:"cover-e" },
        { title:"Projeto Criativo", category:"Pessoal", year:2022, area:"Design", description:"Experimento pessoal de composição e identidade.", skills:["Criatividade","Composição"], tools:"Illustrator • Figma", cover:"cover-f" }
    ];

    const searchInput = $("searchInput");
    const searchContainer = $("searchContainer");
    const searchToggle = $("searchToggle");
    const projectGrid = $("projectGrid");
    const filterButtons = Array.from(document.querySelectorAll(".filter"));
    const sortSelect = $("sortSelect");
    const pagination = $("pagination");

    let selectedFilter = "todos";
    let currentPage = 1;
    let following = false;
    let followers = Number($("followers")?.textContent || 240);
    let selectedPhoto = null;
    let savedPhoto = null;
    let selectedProjectImage = null;
    const perPage = 9;

    // Mensagem temporária
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
        window.__conectaToastTimer = setTimeout(() => node.classList.remove("show"), 2600);
    }

    // Header
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
                currentPage = 1;
                render();
                $("projetos")?.scrollIntoView({ behavior: "smooth" });
            }
        });

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            render();
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                currentPage = 1;
                render();
                $("projetos")?.scrollIntoView({ behavior: "smooth" });
            }
            if (event.key === "Escape") {
                searchInput.value = "";
                currentPage = 1;
                render();
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
                searchToggle.focus();
            }
        });

        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target) && !searchInput.value.trim()) {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAllModals();
    });

    $("notifications")?.addEventListener("click", () => toast("Nenhuma notificação nova."));

    // Lista de projetos
    function getFilteredProjects() {
        const query = normalize(searchInput?.value);
        let list = projects.filter((project) => {
            const categoryMatch = selectedFilter === "todos" ||
                normalize(project.category) === selectedFilter;
            const text = normalize([
                project.title, project.category, project.area,
                project.description, ...project.skills, project.tools
            ].join(" "));
            return categoryMatch && text.includes(query);
        });

        const sort = sortSelect?.value || "recent";
        if (sort === "recent" || sort === "recentes") list.sort((a,b) => b.year-a.year);
        else if (sort === "old" || sort === "antigos") list.sort((a,b) => a.year-b.year);
        else if (sort === "az" || sort === "titulo") list.sort((a,b) => a.title.localeCompare(b.title,"pt-BR"));
        return list;
    }

    function coverClass(cover) {
        return ({
            "cover-a":"image-branding",
            "cover-b":"image-campaign",
            "cover-c":"image-video",
            "cover-d":"image-editorial",
            "cover-e":"image-photo",
            "cover-f":"image-social"
        })[cover] || "image-branding";
    }

    function render() {
        if (!projectGrid) return;
        const list = getFilteredProjects();
        const totalPages = Math.max(1, Math.ceil(list.length / perPage));
        currentPage = Math.min(Math.max(1, currentPage), totalPages);
        const shown = list.slice((currentPage-1)*perPage, currentPage*perPage);
        projectGrid.innerHTML = "";

        shown.forEach((project, index) => {
            const card = document.createElement("article");
            card.className = "project-card";
            card.dataset.category = normalize(project.category);
            card.dataset.year = String(project.year);
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Ver detalhes de ${project.title}`);

            const cover = document.createElement("a");
            cover.href = "#";
            cover.className = `project-image ${coverClass(project.cover)}`;
            cover.setAttribute("aria-label", `Ver projeto ${project.title}`);
            if (project.image) {
                cover.style.backgroundImage = `linear-gradient(#00000018,#00000018), url("${project.image}")`;
                cover.style.backgroundSize = "cover";
                cover.style.backgroundPosition = "center";
            }
            const coverTitle = document.createElement("span");
            coverTitle.textContent = project.title.toUpperCase();
            const coverNumber = document.createElement("small");
            coverNumber.textContent = `PROJETO ${String((currentPage-1)*perPage+index+1).padStart(2,"0")}`;
            cover.append(coverTitle, coverNumber);

            const info = document.createElement("div");
            info.className = "project-info";
            const type = document.createElement("span");
            type.className = "project-type";
            type.textContent = `Projeto ${project.category.toLowerCase()}`;
            const title = document.createElement("h3");
            title.textContent = project.title;
            const meta = document.createElement("span");
            meta.className = "project-meta";
            meta.textContent = `${project.year} • ${project.area}`;
            const desc = document.createElement("p");
            desc.textContent = project.description;
            const tags = document.createElement("div");
            tags.className = "tags";
            project.skills.forEach(skill => {
                const tag = document.createElement("span");
                tag.textContent = skill;
                tags.appendChild(tag);
            });
            info.append(type,title,meta,desc,tags);

            const footer = document.createElement("div");
            footer.className = "project-footer";
            const tools = document.createElement("span");
            tools.textContent = project.tools;
            const view = document.createElement("a");
            view.href = "#";
            view.textContent = "↗";
            view.setAttribute("aria-label","Ver detalhes do projeto");
            footer.append(tools,view);
            card.append(cover,info,footer);

            const open = (event) => {
                if (event) event.preventDefault();
                openProject(project);
            };
            cover.addEventListener("click",open);
            view.addEventListener("click",open);
            card.addEventListener("click",(event) => {
                if (!event.target.closest("a")) openProject(project);
            });
            card.addEventListener("keydown",(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProject(project);
                }
            });
            projectGrid.appendChild(card);
        });

        const resultCount = $("resultCount");
        if (resultCount) resultCount.textContent = `${list.length} ${list.length === 1 ? "resultado" : "resultados"}`;
        $("projectCount") && ($("projectCount").textContent = String(projects.length));
        $("totalProjects") && ($("totalProjects").textContent = `${projects.length} projetos`);
        $("academicCount") && ($("academicCount").textContent = `${projects.filter(p=>p.category==="Acadêmico").length} acadêmicos`);
        $("professionalCount") && ($("professionalCount").textContent = `${projects.filter(p=>p.category==="Profissional").length} profissionais`);
        $("personalCount") && ($("personalCount").textContent = `${projects.filter(p=>p.category==="Pessoal").length} pessoais`);
        renderPagination(totalPages);
    }

    function renderPagination(total) {
        if (!pagination) return;
        pagination.innerHTML = "";
        const makeButton = (label, disabled, handler, active=false) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.disabled = disabled;
            if (active) button.classList.add("active");
            button.addEventListener("click",handler);
            return button;
        };
        pagination.appendChild(makeButton("← Anterior",currentPage===1,()=>{currentPage--;render();}));
        for(let i=1;i<=total;i++) pagination.appendChild(makeButton(String(i),false,()=>{currentPage=i;render();},i===currentPage));
        pagination.appendChild(makeButton("Próxima →",currentPage===total,()=>{currentPage++;render();}));
    }

    // Modais
    function openModal(id) {
        const modal = $(id);
        if (!modal) return;
        modal.style.display = "grid";
        modal.setAttribute("aria-hidden","false");
    }
    function closeModal(id) {
        const modal = $(id);
        if (!modal) return;
        modal.style.display = "none";
        modal.setAttribute("aria-hidden","true");
    }
    function closeAllModals() {
        document.querySelectorAll(".overlay").forEach(modal => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden","true");
        });
    }

    function openProject(project) {
        const title = $("viewProjectTitle");
        const content = $("viewProjectContent");
        if (!title || !content) return;
        title.textContent = project.title;
        content.innerHTML = "";
        const meta = document.createElement("p");
        meta.textContent = `Projeto ${project.category} · ${project.year} · ${project.area}`;
        const description = document.createElement("p");
        description.textContent = project.description;
        const skills = document.createElement("div");
        skills.className = "tags";
        [...project.skills, project.tools].forEach(value => {
            const tag = document.createElement("span");
            tag.textContent = value;
            skills.appendChild(tag);
        });
        if (project.image) {
            const img = document.createElement("img");
            img.src = project.image;
            img.alt = `Imagem do projeto ${project.title}`;
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            content.appendChild(img);
        }
        content.append(meta,description,skills);
        openModal("viewProjectModal");
    }

    // Filtros por categoria
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            selectedFilter = normalize(button.dataset.filter || "todos");
            currentPage = 1;
            render();
        });
    });
    sortSelect?.addEventListener("change", () => { currentPage=1; render(); });

    // Seguir perfil
    $("followBtn")?.addEventListener("click", () => {
        following = !following;
        $("followBtn").textContent = following ? "✓ Seguindo" : "＋ Seguir";
        $("followBtn").classList.toggle("following",following);
        followers += following ? 1 : -1;
        if ($("followers")) $("followers").textContent = String(followers);
        toast(following ? "Você está seguindo Larissa." : "Você deixou de seguir Larissa.");
    });

    // Mensagem
    $("messageBtn")?.addEventListener("click", () => openModal("messageModal"));
    $("sendMessage")?.addEventListener("click", () => {
        const message = $("messageText")?.value.trim();
        if (!message) { toast("Escreva uma mensagem antes de enviar."); return; }
        toast("Mensagem registrada no modo demonstração.");
        if ($("messageText")) $("messageText").value = "";
        closeModal("messageModal");
    });

    $("projectImage")?.addEventListener("change", () => {
        const file = $("projectImage").files?.[0];
        if (!file) { selectedProjectImage = null; return; }
        if (!file.type.startsWith("image/")) {
            toast("Selecione um arquivo de imagem válido.");
            $("projectImage").value = "";
            selectedProjectImage = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = () => { selectedProjectImage = reader.result; };
        reader.readAsDataURL(file);
    });

    $("projectForm")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = $("projectTitle")?.value.trim();
        const category = $("projectCategory")?.value;
        const description = $("projectDescription")?.value.trim();
        if (!title || !category || !description) {
            toast("Preencha os campos obrigatórios.");
            return;
        }
        const newProject = {
            title, category, year: new Date().getFullYear(),
            area: "Comunicação", description,
            skills: ["Comunicação"], tools: "Projeto do estudante",
            cover: ["cover-a","cover-b","cover-c","cover-d","cover-e","cover-f"][projects.length%6],
            image: selectedProjectImage
        };
        projects.unshift(newProject);
        selectedFilter = "todos";
        filterButtons.forEach(button => button.classList.toggle("active",normalize(button.dataset.filter)==="todos"));
        if (searchInput) searchInput.value = "";
        currentPage = 1;
        render();
        closeModal("projectModal");
        toast("Projeto adicionado ao portfólio.");
    });

    // Foto do perfil
    $("editProfileImage")?.addEventListener("click", () => {
        selectedPhoto = savedPhoto;
        if ($("photoInput")) $("photoInput").value = "";
        setPhoto($("photoPreview"),selectedPhoto);
        openModal("profilePhotoModal");
    });
    $("choosePhoto")?.addEventListener("click", () => $("photoInput")?.click());
    $("photoInput")?.addEventListener("change", () => {
        const file = $("photoInput").files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast("Selecione uma imagem válida.");
            $("photoInput").value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            selectedPhoto = reader.result;
            setPhoto($("photoPreview"),selectedPhoto);
        };
        reader.readAsDataURL(file);
    });
    $("saveProfilePhoto")?.addEventListener("click", () => {
        if (!selectedPhoto) {
            toast("Escolha uma imagem antes de salvar.");
            return;
        }
        savedPhoto = selectedPhoto;
        setPhoto($("profileImage"),savedPhoto);
        closeModal("profilePhotoModal");
        toast("Foto de perfil atualizada.");
    });

    function setPhoto(element,image) {
        if (!element) return;
        if (image) {
            element.style.backgroundImage = `url("${image}")`;
            element.style.backgroundSize = "cover";
            element.style.backgroundPosition = "center";
            element.textContent = "";
        } else {
            element.style.backgroundImage = "";
            element.textContent = "LS";
        }
    }

    // Contatos
    document.querySelectorAll("[data-contact]").forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.contact;
            const content = $("contactContent");
            if (content) {
                content.textContent = "";
                const p = document.createElement("p");
                p.textContent = `${type}: informações demonstrativas de contato.`;
                content.appendChild(p);
            }
            openModal("contactModal");
        });
    });

    // Fechar modais
    document.querySelectorAll("[data-close]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.dataset.close));
    });
    document.querySelectorAll(".overlay").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal.id);
        });
    });

    // Renderização inicial
    render();
})();
