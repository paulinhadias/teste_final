/* Dados de vagas iniciais */
const jobs = [
    {
        id: 1,
        title: "Estágio Design Gráfico",
        company: "Nome da empresa",
        location: "São Paulo - SP",
        mode: "Híbrido",
        type: "Estágio",
        area: "Design Gráfico",
        tags: ["Design Gráfico", "Branding"],
        posted: "há 3 dias",
        about: "A Nome da empresa é uma empresa referência no mercado de comunicação e design, atuando com projetos criativos que conectam marcas e pessoas. Nosso time acredita no poder do design para transformar ideias em experiências.",
        tasks: [
            "Criar peças gráficas para campanhas digitais e impressas",
            "Apoiar na construção da identidade visual de marcas",
            "Colaborar com o time criativo em projetos diversos"
        ],
        requirements: [
            "Estudantes de Design, Publicidade, Comunicação ou áreas correlatas",
            "Conhecimento em Photoshop, Illustrator ou Figma",
            "Criatividade, proatividade e vontade de aprender"
        ],
        benefits: [
            "Bolsa-auxílio compatível com o mercado",
            "Vale-transporte",
            "Acompanhamento e desenvolvimento profissional"
        ]
    },
    {
        id: 2,
        title: "Estágio em Comunicação Digital",
        company: "Agência Horizonte",
        location: "Remoto",
        mode: "Remoto",
        type: "Estágio",
        area: "Comunicação",
        tags: ["Conteúdo", "Redes sociais"],
        posted: "há 1 dia",
        about: "Buscamos uma pessoa estudante para apoiar projetos de comunicação digital e criação de conteúdo para diferentes marcas.",
        tasks: [
            "Apoiar calendários de conteúdo",
            "Criar textos e peças para redes sociais",
            "Acompanhar resultados de campanhas"
        ],
        requirements: [
            "Estar cursando Comunicação ou áreas relacionadas",
            "Boa escrita e interesse por mídias digitais"
        ],
        benefits: [
            "Modelo remoto",
            "Mentoria da equipe",
            "Horário flexível"
        ]
    },
    {
        id: 3,
        title: "Designer Freelancer",
        company: "Estúdio Ponto",
        location: "São Paulo - SP",
        mode: "Remoto",
        type: "Freelancer",
        area: "Design",
        tags: ["Identidade visual", "Editorial"],
        posted: "há 5 dias",
        about: "O Estúdio Ponto procura profissional freelancer para colaborar em projetos de identidade visual e materiais de comunicação.",
        tasks: [
            "Desenvolver peças e sistemas visuais",
            "Participar de reuniões de alinhamento",
            "Preparar arquivos finais"
        ],
        requirements: [
            "Portfólio com projetos de design",
            "Domínio de ferramentas gráficas",
            "Organização e comunicação"
        ],
        benefits: [
            "Trabalho por projeto",
            "Briefings claros",
            "Possibilidade de parceria contínua"
        ]
    },
    {
        id: 4,
        title: "Assistente de Criação Júnior",
        company: "Mosaico Comunicação",
        location: "Rio de Janeiro - RJ",
        mode: "Híbrido",
        type: "Júnior",
        area: "Publicidade",
        tags: ["Direção de arte", "Campanhas"],
        posted: "há 2 dias",
        about: "Vaga para integrar o time criativo em campanhas e projetos de comunicação de marcas.",
        tasks: [
            "Apoiar criação de conceitos e campanhas",
            "Desenvolver layouts e apresentações",
            "Trabalhar junto a redação e planejamento"
        ],
        requirements: [
            "Formação ou graduação em andamento na área",
            "Conhecimento em ferramentas de criação",
            "Vontade de aprender em equipe"
        ],
        benefits: [
            "Plano de desenvolvimento",
            "Vale-refeição",
            "Ambiente colaborativo"
        ]
    },
    {
        id: 5,
        title: "Estágio em Produção Audiovisual",
        company: "Frame Lab",
        location: "Curitiba - PR",
        mode: "Presencial",
        type: "Estágio",
        area: "Audiovisual",
        tags: ["Vídeo", "Edição"],
        posted: "há 6 dias",
        about: "A Frame Lab realiza projetos audiovisuais para marcas, instituições e iniciativas culturais.",
        tasks: [
            "Apoiar gravações e produção",
            "Organizar materiais e arquivos",
            "Auxiliar na edição de vídeos"
        ],
        requirements: [
            "Estudante de Audiovisual ou Comunicação",
            "Interesse em produção e edição",
            "Disponibilidade para atividades presenciais"
        ],
        benefits: [
            "Experiência prática",
            "Acesso a equipamentos",
            "Acompanhamento de profissionais"
        ]
    }
];

/* ==========================================================================
   2. ESTADO DA APLICAÇÃO E UTILITÁRIOS
   ========================================================================== */
let selected = 1;
let activeType = "Todos";
const saved = new Set();
const interested = new Set();
const extraJobs = [];

const $ = id => document.getElementById(id);

function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function allJobs() {
    return [...extraJobs, ...jobs];
}

/* Cabeçalho */
(() => {
    "use strict";

    const searchContainer = document.getElementById("searchContainer");
    const searchInput = document.getElementById("searchInput");
    const searchToggle = document.getElementById("searchToggle");

    if (searchContainer && searchInput && searchToggle) {
        searchToggle.addEventListener("click", () => {
            const active = searchContainer.classList.toggle("active");
            searchToggle.setAttribute("aria-expanded", String(active));
            if (active) searchInput.focus();
            else searchInput.value = "";
        });

        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target) && searchInput.value.trim() === "") {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && searchInput.value.trim()) {
                const query = encodeURIComponent(searchInput.value.trim());
                window.location.href = `talentos.html?q=${query}`;
            }
        });
    }

})();

/* Filtros */
function filtered() {
    const q = $("q").value.toLowerCase();
    const loc = $("location").value.toLowerCase();

    return allJobs().filter(j =>
        (activeType === "Todos" || j.type === activeType) &&
        (!q || [j.title, j.area, ...j.tags].join(" ").toLowerCase().includes(q)) &&
        (!loc || [j.location, j.mode].join(" ").toLowerCase().includes(loc))
    );
}

function renderList() {
    const arr = filtered();
    $("count").textContent = `${arr.length} oportunidade${arr.length === 1 ? "" : "s"}`;

    const root = $("jobList");
    root.innerHTML = "";

    if (!arr.length) {
        root.innerHTML = '<div class="empty">Nenhuma vaga encontrada.<br>Experimente ajustar os filtros.</div>';
        $("detail").innerHTML = '<div class="empty">Selecione uma oportunidade para ver os detalhes.</div>';
        return;
    }

    if (!arr.some(j => j.id === selected)) {
        selected = arr[0].id;
    }

    arr.forEach(j => {
        const card = document.createElement("article");
        card.className = "job-card" + (j.id === selected ? " active" : "");
        card.innerHTML = `
      <div class="job-card-head">
        <div>
          <h3>${esc(j.title)}</h3>
          <div class="company">${esc(j.company)}</div>
        </div>
        <span class="posted">${esc(j.posted)}</span>
      </div>
      <div class="job-meta">${esc(j.location)} · ${esc(j.mode)}</div>
      <div class="tags">
        ${j.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}
      </div>
    `;

        card.onclick = () => {
            selected = j.id;
            renderList();
            renderDetail();
        };

        root.append(card);
    });

    renderDetail();
}

function renderDetail() {
    const j = allJobs().find(x => x.id === selected);
    if (!j) return;

    const isSaved = saved.has(j.id);
    const isInt = interested.has(j.id);

    $("detail").innerHTML = `
    <div class="detail-head">
      <div class="detail-top">
        <div>
          <h2>${esc(j.title)}</h2>
          <div class="company">${esc(j.company)}</div>
        </div>
        <span class="tag">${esc(j.type)}</span>
      </div>
      <div class="detail-meta">
        <span>⌖ ${esc(j.location)}</span>
        <span>▣ ${esc(j.mode)}</span>
        <span>▦ Publicado ${esc(j.posted)}</span>
      </div>
      <div class="actions">
        <button class="interest" id="interest">${isInt ? "✓ Interesse demonstrado" : "♡ Tenho interesse"}</button>
        <button class="save ${isSaved ? "saved" : ""}" id="save">${isSaved ? "✓ Salva" : "♧ Salvar oportunidade"}</button>
      </div>
    </div>
    <div class="tabs">
      <button class="active" data-tab="about">Sobre a vaga</button>
      <button data-tab="requirements">Requisitos</button>
      <button data-tab="benefits">Benefícios</button>
      <button data-tab="company">Sobre a empresa</button>
    </div>
    <div class="detail-body" id="detailBody"></div>
  `;

    showTab("about", j);

    $("interest").onclick = () => {
        if (interested.has(j.id)) {
            interested.delete(j.id);
            toast("Interesse removido.");
        } else {
            interested.add(j.id);
            toast("Interesse demonstrado! Seu perfil e portfólio poderão ser compartilhados na candidatura.");
        }
        renderDetail();
    };

    $("save").onclick = () => {
        if (saved.has(j.id)) {
            saved.delete(j.id);
            toast("Oportunidade removida dos salvos.");
        } else {
            saved.add(j.id);
            toast("Oportunidade salva.");
        }
        renderDetail();
    };

    document.querySelectorAll("[data-tab]").forEach(b => {
        b.onclick = () => {
            document.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("active", x === b));
            showTab(b.dataset.tab, j);
        };
    });
}

function showTab(tab, j) {
    const body = $("detailBody");

    if (tab === "about") {
        body.innerHTML = `
      <h3>Sobre a vaga</h3>
      <p>${esc(j.about)}</p>
      <h3>O que você vai desenvolver</h3>
      <ul>${j.tasks.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="company-box">
        <h3>O que buscamos</h3>
        <ul>${j.requirements.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="steps">
        <div class="step">
          <b>1 · Demonstrar interesse</b>
          <span>Clique em “Tenho interesse” para sinalizar que combina com a vaga.</span>
        </div>
        <div class="step">
          <b>2 · Apresentar seu portfólio</b>
          <span>Compartilhe seu perfil e suas principais produções.</span>
        </div>
        <div class="step">
          <b>3 · Conversar com a empresa</b>
          <span>Se houver interesse, a equipe poderá entrar em contato.</span>
        </div>
      </div>
    `;
    } else if (tab === "requirements") {
        body.innerHTML = `
      <h3>Requisitos</h3>
      <ul>${j.requirements.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    `;
    } else if (tab === "benefits") {
        const list = j.benefits || ["Informações não disponibilizadas pela empresa"];
        body.innerHTML = `
      <h3>Benefícios</h3>
      <ul>${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    `;
    } else {
        body.innerHTML = `
      <div class="company-box">
        <h3>${esc(j.company)}</h3>
        <p>${esc(j.about)}</p>
        <p>Empresa anunciante no Conecta.</p>
      </div>
    `;
    }
}

/* Notificações */
function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        t.style.display = "none";
    }, 3000);
}

/* Inicialização */
$("q").oninput = renderList;
$("location").oninput = renderList;

document.querySelectorAll("[data-type]").forEach(b => {
    b.onclick = () => {
        activeType = b.dataset.type;
        document.querySelectorAll("[data-type]").forEach(x => x.classList.toggle("selected", x === b));
        renderList();
    };
});

$("clear").onclick = () => {
    $("q").value = "";
    $("location").value = "";
    activeType = "Todos";
    document.querySelectorAll("[data-type]").forEach(x => x.classList.toggle("selected", x.dataset.type === "Todos"));
    renderList();
};

$("openPost").onclick = () => {
    $("postOverlay").style.display = "grid";
};

$("closePost").onclick = () => {
    $("postOverlay").style.display = "none";
};

$("postOverlay").onclick = e => {
    if (e.target === $("postOverlay")) {
        $("postOverlay").style.display = "none";
    }
};

$("postForm").onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const id = Date.now();

    extraJobs.unshift({
        id,
        title: f.get("title"),
        company: f.get("company"),
        type: f.get("type"),
        area: f.get("area"),
        location: f.get("location") || "A combinar",
        mode: f.get("mode"),
        tags: [f.get("area")],
        posted: "agora",
        about: f.get("about"),
        tasks: ["Atividades a combinar com a empresa"],
        requirements: (f.get("requirements") || "A combinar").split("\n").filter(Boolean),
        benefits: (f.get("benefits") || "A combinar").split("\n").filter(Boolean)
    });

    selected = id;
    $("postOverlay").style.display = "none";
    e.target.reset();
    renderList();
    toast("Vaga adicionada ao protótipo!");
};

renderList();
