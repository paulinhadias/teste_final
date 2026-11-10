(() => {
    "use strict";

    // Dados dos estudantes
    const talentos = [
    {
        nome: "Mariana Souza", iniciais: "MS", area: "Design gráfico", categoria: "design",
        cidade: "Salvador, BA",
        bio: "Identidade visual e design editorial para marcas autorais e projetos acadêmicos.",
        tags: ["Branding", "Design editorial"],
        projetos: 6, disponivel: true, cor: "image-branding"
    },
    {
        nome: "Lucas Almeida", iniciais: "LA", area: "Audiovisual", categoria: "audiovisual",
        cidade: "São Paulo, SP",
        bio: "Roteiro, captação e edição de vídeos curtos, documentários e conteúdo para redes.",
        tags: ["Edição de vídeo", "Roteiro"],
        projetos: 4, disponivel: true, cor: "image-video"
    },
    {
        nome: "Beatriz Costa", iniciais: "BC", area: "Fotografia", categoria: "fotografia",
        cidade: "Recife, PE",
        bio: "Retrato e fotografia documental, com olhar atento ao cotidiano e às pessoas.",
        tags: ["Retrato", "Documental"],
        projetos: 8, disponivel: false, cor: "image-photo"
    },
    {
        nome: "Rafael Lima", iniciais: "RL", area: "Marketing digital", categoria: "marketing",
        cidade: "Belo Horizonte, MG",
        bio: "Planejamento de conteúdo, calendário editorial e gestão de redes sociais.",
        tags: ["Redes sociais", "Conteúdo"],
        projetos: 5, disponivel: true, cor: "image-social"
    },
    {
        nome: "Camila Ferreira", iniciais: "CF", area: "Redação e conteúdo", categoria: "redacao",
        cidade: "Curitiba, PR",
        bio: "Textos para blogs, newsletters e campanhas, com foco em clareza e storytelling.",
        tags: ["Copywriting", "Conteúdo"],
        projetos: 3, disponivel: true, cor: "image-editorial"
    },
    {
        nome: "Gabriel Rocha", iniciais: "GR", area: "Design de interfaces", categoria: "design",
        cidade: "Fortaleza, CE",
        bio: "Criação de telas e protótipos de aplicativos e sites com foco na experiência do usuário.",
        tags: ["UI design", "Prototipação"],
        projetos: 7, disponivel: false, cor: "image-campaign"
    },
    {
        nome: "Isabela Martins", iniciais: "IM", area: "Podcast e áudio", categoria: "audiovisual",
        cidade: "Porto Alegre, RS",
        bio: "Produção de podcasts universitários: pauta, gravação, edição e publicação.",
        tags: ["Podcast", "Roteiro"],
        projetos: 2, disponivel: true, cor: "image-video"
    },
    {
        nome: "Thiago Nunes", iniciais: "TN", area: "Publicidade", categoria: "marketing",
        cidade: "Rio de Janeiro, RJ",
        bio: "Conceito e estratégia de campanhas publicitárias para produtos e causas.",
        tags: ["Campanhas", "Estratégia"],
        projetos: 6, disponivel: true, cor: "image-campaign"
    },
    {
        nome: "Larissa Pereira", iniciais: "LP", area: "Fotografia", categoria: "fotografia",
        cidade: "Brasília, DF",
        bio: "Ensaios autorais e direção de arte para projetos de moda e comportamento.",
        tags: ["Direção de arte", "Ensaio"],
        projetos: 4, disponivel: false, cor: "image-photo"
    },
    {
        nome: "Pedro Santos", iniciais: "PS", area: "Jornalismo", categoria: "redacao",
        cidade: "Goiânia, GO",
        bio: "Reportagens e coberturas de eventos universitários, com apuração e entrevistas.",
        tags: ["Reportagem", "Cobertura"],
        projetos: 5, disponivel: true, cor: "image-editorial"
    },
    {
        nome: "Ana Beatriz Oliveira", iniciais: "AO", area: "Ilustração", categoria: "design",
        cidade: "Florianópolis, SC",
        bio: "Ilustrações digitais e materiais gráficos para livros, cartilhas e campanhas.",
        tags: ["Ilustração", "Design editorial"],
        projetos: 9, disponivel: true, cor: "image-branding"
    },
    {
        nome: "Felipe Barbosa", iniciais: "FB", area: "Motion design", categoria: "audiovisual",
        cidade: "Belém, PA",
        bio: "Animações e motion graphics para vídeos, vinhetas e apresentações.",
        tags: ["Motion graphics", "Animação"],
        projetos: 3, disponivel: false, cor: "image-social"
    }
    ];

    // Elementos da página
    const $ = (id) => document.getElementById(id);
    const grade = $("talentGrid");
    const mensagemVazia = $("emptyMessage");
    const contador = $("resultCount");
    const ordenar = $("sortSelect");
    const botoesFiltro = document.querySelectorAll(".filter");
    const searchInput = $("searchInput");
    const searchContainer = $("searchContainer");
    const searchToggle = $("searchToggle");

    let filtroAtual = "todos";

    const normalizar = (texto) => (texto || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    // Card de estudante
    function criarCard(t) {
        const status = t.disponivel
            ? '<span class="talent-status available"><i></i>Disponível para projetos</span>'
            : '<span class="talent-status"><i></i>Indisponível no momento</span>';
        return `
            <a href="perfil_pessoal.html" class="talent-card" aria-label="Ver perfil de ${t.nome}">
                <div class="talent-top">
                    <span class="talent-avatar ${t.cor}" aria-hidden="true">${t.iniciais}</span>
                    <div>
                        <h3>${t.nome}</h3>
                        <span class="talent-role">${t.area}</span>
                    </div>
                </div>
                <span class="talent-location">${t.cidade}</span>
                <p>${t.bio}</p>
                <div class="tags">
                    ${t.tags.map((tag) => `<span>${tag}</span>`).join("")}
                </div>
                <div class="talent-footer">
                    ${status}
                    <span class="talent-projects">${t.projetos} ${t.projetos === 1 ? "projeto" : "projetos"}</span>
                </div>
            </a>`;
    }

    // Busca e filtro
    function atualizar() {
        const busca = normalizar(searchInput?.value);
        const criterio = ordenar.value;

        const lista = talentos
            .filter((t) => {
                const filtroOk = filtroAtual === "todos"
                    || (filtroAtual === "disponivel" ? t.disponivel : t.categoria === filtroAtual);
                const texto = normalizar([t.nome, t.area, t.cidade, t.bio, t.tags.join(" ")].join(" "));
                return filtroOk && texto.includes(busca);
            })
            .sort((a, b) => criterio === "projetos"
                ? b.projetos - a.projetos || a.nome.localeCompare(b.nome, "pt-BR")
                : a.nome.localeCompare(b.nome, "pt-BR"));

        grade.innerHTML = lista.map(criarCard).join("");
        mensagemVazia.style.display = lista.length ? "none" : "block";
        contador.textContent = `${lista.length} ${lista.length === 1 ? "estudante" : "estudantes"}`;
    }

    botoesFiltro.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesFiltro.forEach((item) => item.classList.remove("active"));
            botao.classList.add("active");
            filtroAtual = botao.dataset.filter;
            atualizar();
        });
    });

    ordenar.addEventListener("change", atualizar);

    // ===== BUSCA DO CABEÇALHO =====
    function abrirBusca() {
        searchContainer.classList.add("active");
        searchToggle.setAttribute("aria-expanded", "true");
    }

    function fecharBusca() {
        searchContainer.classList.remove("active");
        searchToggle.setAttribute("aria-expanded", "false");
    }

    searchToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!searchContainer.classList.contains("active")) {
            abrirBusca();
            searchInput.focus();
        } else if (!searchInput.value.trim()) {
            fecharBusca();
        }
    });

    searchInput.addEventListener("input", atualizar);

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchInput.value = "";
            atualizar();
            fecharBusca();
            searchToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!searchContainer.contains(event.target) && !searchInput.value.trim()) fecharBusca();
    });

    const termo = new URLSearchParams(window.location.search).get("q");
    if (termo) {
        searchInput.value = termo;
        abrirBusca();
    }

    atualizar();
})();
