(() => {
    "use strict";

    // Projetos publicados
    const projetos = [
    {
        categoria: "academico", ano: 2026, imagem: "image-branding",
        rotulo: "IDENTIDADE<br>VISUAL",
        tipo: "Projeto acadêmico", titulo: "Identidade Visual", area: "Comunicação",
        descricao: "Criação de um sistema visual para uma marca fictícia.",
        tags: ["Branding", "Design gráfico"],
        ferramentas: "Illustrator • Figma"
    },
    {
        categoria: "profissional", ano: 2025, imagem: "image-campaign",
        rotulo: "CAMPANHA<br>DIGITAL",
        tipo: "Projeto profissional", titulo: "Campanha Digital", area: "Comunicação",
        descricao: "Planejamento de campanha para redes sociais.",
        tags: ["Publicidade", "Mídias sociais"],
        ferramentas: "Photoshop • Canva"
    },
    {
        categoria: "academico", ano: 2025, imagem: "image-video",
        rotulo: "PROJETO<br>AUDIOVISUAL",
        tipo: "Projeto acadêmico", titulo: "Projeto Audiovisual", area: "Comunicação",
        descricao: "Conceito, roteiro e produção de conteúdo em vídeo.",
        tags: ["Audiovisual", "Produção"],
        ferramentas: "Premiere • CapCut"
    },
    {
        categoria: "pessoal", ano: 2025, imagem: "image-editorial",
        rotulo: "DESIGN<br>EDITORIAL",
        tipo: "Projeto pessoal", titulo: "Editorial", area: "Comunicação",
        descricao: "Exploração de composição e narrativa visual.",
        tags: ["Design editorial", "Tipografia"],
        ferramentas: "InDesign • Photoshop"
    },
    {
        categoria: "academico", ano: 2024, imagem: "image-photo",
        rotulo: "FOTOGRAFIA<br>DOCUMENTAL",
        tipo: "Projeto acadêmico", titulo: "Fotografia Documental", area: "Comunicação",
        descricao: "Ensaio visual sobre cotidiano e território.",
        tags: ["Fotografia", "Documental"],
        ferramentas: "Lightroom • Câmera"
    },
    {
        categoria: "voluntario", ano: 2024, imagem: "image-social",
        rotulo: "AÇÃO DE<br>COMUNICAÇÃO",
        tipo: "Projeto voluntário", titulo: "Ação de Comunicação", area: "Comunicação",
        descricao: "Materiais de divulgação para uma iniciativa social.",
        tags: ["Comunicação", "Impacto social"],
        ferramentas: "Canva • Illustrator"
    },
    {
        categoria: "academico", ano: 2026, imagem: "image-video",
        rotulo: "PODCAST<br>UNIVERSITÁRIO",
        tipo: "Projeto acadêmico", titulo: "Podcast Universitário", area: "Comunicação",
        descricao: "Série de episódios sobre a vida acadêmica, com roteiro, gravação e edição.",
        tags: ["Áudio", "Roteiro"],
        ferramentas: "Audacity • Canva"
    },
    {
        categoria: "profissional", ano: 2026, imagem: "image-social",
        rotulo: "GESTÃO DE<br>REDES",
        tipo: "Projeto profissional", titulo: "Gestão de Redes Sociais", area: "Comunicação",
        descricao: "Planejamento de conteúdo e calendário editorial para uma marca local.",
        tags: ["Redes sociais", "Conteúdo"],
        ferramentas: "Canva • Meta Business"
    },
    {
        categoria: "pessoal", ano: 2026, imagem: "image-photo",
        rotulo: "ENSAIO<br>FOTOGRÁFICO",
        tipo: "Projeto pessoal", titulo: "Ensaio Fotográfico", area: "Comunicação",
        descricao: "Série de retratos em luz natural sobre identidade e cotidiano.",
        tags: ["Fotografia", "Retrato"],
        ferramentas: "Lightroom • Câmera"
    },
    {
        categoria: "voluntario", ano: 2025, imagem: "image-editorial",
        rotulo: "CARTILHA<br>EDUCATIVA",
        tipo: "Projeto voluntário", titulo: "Cartilha Educativa", area: "Comunicação",
        descricao: "Material informativo diagramado para uma ONG de educação.",
        tags: ["Editorial", "Impacto social"],
        ferramentas: "InDesign • Illustrator"
    },
    {
        categoria: "academico", ano: 2024, imagem: "image-campaign",
        rotulo: "CAMPANHA<br>PUBLICITÁRIA",
        tipo: "Projeto acadêmico", titulo: "Campanha Publicitária", area: "Comunicação",
        descricao: "Conceito, peças e plano de mídia para um produto fictício.",
        tags: ["Publicidade", "Criatividade"],
        ferramentas: "Photoshop • Illustrator"
    },
    {
        categoria: "profissional", ano: 2024, imagem: "image-branding",
        rotulo: "REDESIGN<br>DE MARCA",
        tipo: "Projeto profissional", titulo: "Redesign de Marca", area: "Comunicação",
        descricao: "Atualização da identidade visual de um pequeno negócio local.",
        tags: ["Branding", "Redesign"],
        ferramentas: "Figma • Illustrator"
    }
    ];

    // Elementos da página
    const $ = (id) => document.getElementById(id);
    const grade = $("projectGrid");
    const mensagemVazia = $("emptyMessage");
    const contador = $("resultCount");
    const ordenar = $("sortSelect");
    const botoesFiltro = document.querySelectorAll(".filter");
    const searchInput = $("searchInput");
    const searchContainer = $("searchContainer");
    const searchToggle = $("searchToggle");

    let filtroAtual = "todos";

    // Remove acentos e maiúsculas para comparar textos
    const normalizar = (texto) => (texto || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    // Cards de projeto
    function criarCard(p, posicao) {
        const numero = String(posicao + 1).padStart(2, "0");
        return `
            <article class="project-card">
                <a href="perfil_pessoal.html#projetos" class="project-image ${p.imagem}">
                    <span>${p.rotulo}</span>
                    <small>PROJETO ${numero}</small>
                </a>
                <div class="project-info">
                    <span class="project-type">${p.tipo}</span>
                    <h3>${p.titulo}</h3>
                    <span class="project-meta">${p.ano} • ${p.area}</span>
                    <p>${p.descricao}</p>
                    <div class="tags">
                        ${p.tags.map((tag) => `<span>${tag}</span>`).join("")}
                    </div>
                    <div class="project-footer">
                        <span>${p.ferramentas}</span>
                        <a href="perfil_pessoal.html#projetos" aria-label="Ver projeto">↗</a>
                    </div>
                </div>
            </article>`;
    }

    // Busca, filtro e ordem
    function atualizar() {
        const busca = normalizar(searchInput?.value);
        const criterio = ordenar.value;

        const lista = projetos
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => {
                const categoriaOk = filtroAtual === "todos" || p.categoria === filtroAtual;
                const texto = normalizar([p.titulo, p.tipo, p.area, p.descricao, p.tags.join(" "), p.ferramentas].join(" "));
                return categoriaOk && texto.includes(busca);
            })
            .sort((a, b) => {
                if (criterio === "antigos") return a.p.ano - b.p.ano || a.i - b.i;
                if (criterio === "titulo") return a.p.titulo.localeCompare(b.p.titulo, "pt-BR");
                return b.p.ano - a.p.ano || a.i - b.i;
            });

        grade.innerHTML = lista.map(({ p, i }) => criarCard(p, i)).join("");
        mensagemVazia.style.display = lista.length ? "none" : "block";
        contador.textContent = `${lista.length} ${lista.length === 1 ? "projeto" : "projetos"}`;
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

    // Busca do cabeçalho
    function fecharBusca() {
        searchContainer.classList.remove("active");
        searchToggle.setAttribute("aria-expanded", "false");
    }

    searchToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!searchContainer.classList.contains("active")) {
            searchContainer.classList.add("active");
            searchToggle.setAttribute("aria-expanded", "true");
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

    atualizar();
})();
