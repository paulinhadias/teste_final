const $ = id => document.getElementById(id);

// Estado do editor
let blockCounter = 0, currentEdit = null, pendingType = null, coverData = "", tools = [], skills = [];

// Blocos iniciais do projeto
const defaultBlocks = [
    { type: "about", title: "Sobre o projeto", fields: [["Contexto / Desafio", "Descreva o contexto do projeto..."], ["Objetivo", "Qual era o objetivo?"], ["Público-alvo", "Quem é o público?"], ["Conceito criativo", "Qual foi a ideia central?"]] },
    { type: "image", title: "Imagem", items: [] },
    { type: "text", title: "Sobre a marca", text: "Conte sobre a marca, seu propósito e como o projeto se conecta com ela..." },
    { type: "gallery", title: "Galeria", items: [] },
    { type: "gallery", title: "Galeria", items: [] }
];

let blocks = [];

// Mensagem temporária
function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(window.tt);
    window.tt = setTimeout(() => t.style.display = "none", 2500);
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Detalhes do projeto
function setupYears() {
    let y = new Date().getFullYear();
    for (let i = y; i >= 1990; i--) {
        let o = document.createElement("option");
        o.value = i;
        o.textContent = i;
        $("yearInput").append(o);
    }
}

function renderTags(kind) {
    let arr = kind === "tools" ? tools : skills, el = $(kind === "tools" ? "toolsTags" : "skillsTags");
    el.innerHTML = "";
    arr.forEach((v, i) => {
        let tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = v;
        let x = document.createElement("button");
        x.type = "button";
        x.textContent = "×";
        x.onclick = () => {
            arr.splice(i, 1);
            renderTags(kind);
            markUnsaved();
        };
        tag.append(x);
        el.append(tag);
    });
}

function addTag(kind, value) {
    let v = value.trim();
    if (!v)
        return;
    let arr = kind === "tools" ? tools : skills;
    if (!arr.includes(v))
        arr.push(v);
    renderTags(kind);
    markUnsaved();
}

["tools", "skills"].forEach(kind => {
    let input = $(kind + "Input");
    input.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(kind, input.value.replace(/,$/, ""));
            input.value = "";
        }
    });
    input.addEventListener("blur", () => {
        if (input.value.trim()) {
            addTag(kind, input.value);
            input.value = "";
        }
    });
});

// Status de salvamento
function markUnsaved() {
    $("saveStatus").textContent = "Alterações não salvas";
}

function updateHeader() {
    $("projectTitleDisplay").textContent = $("titleInput").value.trim() || "Título do projeto";
    $("categoryDisplay").textContent = $("categoryInput").value || "Projeto Acadêmico";
    $("areaDisplay").textContent = $("areaInput").value || "Branding";
}

["titleInput", "categoryInput", "areaInput"].forEach(id => $(id).addEventListener("input", () => {
    updateHeader();
    markUnsaved();
}));

// Blocos de conteúdo
function blockToolsHTML() {
    return `<div class="block-tools"><button data-action="moveUp" title="Mover para cima">↕</button><button data-action="edit" title="Editar">✎</button><button data-action="delete" title="Remover">⌫</button></div>`;
}

function renderBlocks() {
    let root = $("blocks");
    root.innerHTML = "";
    blocks.forEach((b, i) => {
        let el = document.createElement("section");
        el.className = "content-block";
        el.dataset.id = b.id;
        let head = document.createElement("div");
        head.className = "block-head";
        let title = document.createElement("strong");
        title.textContent = b.title || typeTitle(b.type);
        head.append(title);
        head.insertAdjacentHTML("beforeend", blockToolsHTML());
        let body = document.createElement("div");
        body.className = "block-body";
        body.innerHTML = blockBodyHTML(b);
        el.append(head, body);
        root.append(el);
        el.querySelectorAll("[data-action]").forEach(btn => btn.addEventListener("click", () => handleBlockAction(b.id, btn.dataset.action)));
        body.querySelectorAll("[data-field]").forEach(field => field.addEventListener("input", () => {
            let key = field.dataset.field;
            if (key.startsWith("field-"))
                b.fields[Number(key.split("-")[1])][1] = field.textContent;
            else if (key === "text")
                b.text = field.textContent;
            markUnsaved();
        }));
        body.querySelectorAll("[data-upload]").forEach(btn => btn.addEventListener("click", () => chooseMedia(b.id, btn.dataset.upload)));
        body.querySelectorAll("[data-remove-media]").forEach(btn => btn.addEventListener("click", () => {
            b.items.splice(Number(btn.dataset.removeMedia), 1);
            renderBlocks();
            markUnsaved();
        }));
        body.querySelectorAll("[data-edit-media]").forEach(btn => btn.addEventListener("click", () => chooseMedia(b.id, b.type)));
    });
}

function blockBodyHTML(b) {
    if (b.type === "about")
        return `<div class="about-grid">${b.fields.map((f, i) => `<div class="about-field"><strong>${esc(f[0])}</strong><p contenteditable="true" data-field="field-${i}">${esc(f[1])}</p></div>`).join("")}</div>`;
    if (b.type === "text")
        return `<div class="text-content" contenteditable="true" data-field="text">${esc(b.text || "Clique para escrever seu texto...")}</div>`;
    if (b.type === "image")
        return mediaHTML(b, true);
    if (b.type === "gallery")
        return mediaHTML(b, false);
    if (b.type === "video")
        return mediaHTML(b, false);
    if (b.type === "embed")
        return `<p>${esc(b.url || "Adicione um link incorporável pelo botão de edição.")}</p>`;
    if (b.type === "credits")
        return `<div class="credits-list" contenteditable="true" data-field="text">${esc(b.text || "Créditos e colaboradores...")}</div>`;
    return `<p contenteditable="true" data-field="text">${esc(b.text || "Escreva aqui...")}</p>`;
}

function mediaHTML(b, single) {
    if (!b.items?.length)
        return `<div class="media-grid"><div class="media-item"><span class="empty-media">${b.type === "video" ? "▷" : "▧"}</span><button class="outline" data-upload="${b.type}">＋ ${b.type === "video" ? "Adicionar vídeo/áudio" : "Adicionar mídia"}</button></div></div>`;
    return `<div class="media-grid">${b.items.map((item, i) => `<div class="media-item">${item.kind === "video" ? `<video controls src="${item.src}"></video>` : `<img src="${item.src}" alt="Mídia do projeto">`}<button class="remove-media" data-remove-media="${i}" title="Remover">×</button></div>`).join("")}${single ? "" : `<div class="media-item"><button class="outline" data-upload="${b.type}">＋ Adicionar mídia</button></div>`}</div>`;
}

function typeTitle(t) {
    return ({ image: "Imagem", text: "Texto", gallery: "Galeria", video: "Vídeo / Áudio", embed: "Incorporar", about: "Sobre o projeto", credits: "Créditos" })[t] || "Conteúdo";
}

function addBlock(type) {
    let b = { id: ++blockCounter, type, title: typeTitle(type), text: "", items: [] };
    if (type === "about")
        b.fields = [["Contexto / Desafio", "Descreva o contexto..."], ["Objetivo", "Qual era o objetivo?"], ["Público-alvo", "Quem é o público?"], ["Conceito criativo", "Qual foi a ideia central?"]];
    blocks.push(b);
    renderBlocks();
    markUnsaved();
    if (["image", "gallery", "video"].includes(type))
        chooseMedia(b.id, type);
    else if (["text", "embed", "credits"].includes(type))
        openBlockEditor(b.id);
}

function handleBlockAction(id, action) {
    let idx = blocks.findIndex(b => b.id === id);
    if (action === "delete") {
        if (confirm("Remover este bloco?")) {
            blocks.splice(idx, 1);
            renderBlocks();
            markUnsaved();
        }
    }
    if (action === "moveUp" && idx > 0) {
        [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
        renderBlocks();
        markUnsaved();
    }
    if (action === "edit")
        openBlockEditor(id);
}

function openBlockEditor(id) {
    currentEdit = id;
    let b = blocks.find(x => x.id === id);
    $("blockModalTitle").textContent = "Editar " + typeTitle(b.type).toLowerCase();
    let area = $("blockFormArea");
    area.innerHTML = "";
    if (b.type === "about") {
        area.innerHTML = `<p>Edite os campos diretamente no bloco da página.</p><button class="primary" id="doneEdit">Concluir</button>`;
    }
    else if (b.type === "text" || b.type === "credits") {
        area.innerHTML = `<label>Título do bloco<input id="editBlockTitle" value="${esc(b.title)}"></label><label>Conteúdo<textarea id="editBlockText" rows="7">${esc(b.text || "")}</textarea></label><button class="primary" id="doneEdit">Salvar alterações</button>`;
    }
    else if (b.type === "embed") {
        area.innerHTML = `<label>Título<input id="editBlockTitle" value="${esc(b.title)}"></label><label>URL para incorporar<input id="editBlockUrl" type="url" placeholder="https://..." value="${esc(b.url || "")}"></label><p>Use links públicos de conteúdo que permita incorporação.</p><button class="primary" id="doneEdit">Salvar</button>`;
    }
    else {
        area.innerHTML = `<label>Título do bloco<input id="editBlockTitle" value="${esc(b.title)}"></label><button class="primary" id="doneEdit">Salvar</button><button class="outline" id="replaceMedia">Adicionar/substituir mídia</button>`;
    }
    $("doneEdit").onclick = () => {
        if ($("editBlockTitle"))
            b.title = $("editBlockTitle").value || typeTitle(b.type);
        if ($("editBlockText"))
            b.text = $("editBlockText").value;
        if ($("editBlockUrl"))
            b.url = $("editBlockUrl").value;
        renderBlocks();
        $("blockOverlay").style.display = "none";
        markUnsaved();
    };
    if ($("replaceMedia"))
        $("replaceMedia").onclick = () => {
            $("blockOverlay").style.display = "none";
            chooseMedia(b.id, b.type);
        };
    $("blockOverlay").style.display = "grid";
}

function chooseMedia(id, type) {
    currentEdit = id;
    pendingType = type;
    let input = type === "video" ? $("hiddenVideoInput") : $("hiddenImageInput");
    input.value = "";
    input.click();
    input.onchange = () => {
        let b = blocks.find(x => x.id === id);
        if (!b || !input.files.length)
            return;
        Array.from(input.files).forEach(file => {
            let src = URL.createObjectURL(file);
            b.items = b.items || [];
            b.items.push({ src, kind: file.type.startsWith("video") || file.type.startsWith("audio") ? "video" : "image", name: file.name });
        });
        renderBlocks();
        markUnsaved();
    };
}

// Adicionar blocos e enviar mídia
document.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addBlock(btn.dataset.add)));

$("addBlockMain").addEventListener("click", () => {
    let types = ["image", "text", "gallery", "video", "embed", "about", "credits"];
    let choice = prompt("Qual bloco deseja adicionar?\\n1 Imagem\\n2 Texto\\n3 Galeria\\n4 Vídeo/Áudio\\n5 Incorporar\\n6 Sobre o projeto\\n7 Créditos");
    let type = types[Number(choice) - 1];
    if (type)
        addBlock(type);
});

$("selectCover").onclick = () => $("coverFile").click();
$("coverArea").querySelectorAll('[data-action="cover"]').forEach(b => b.onclick = () => $("coverFile").click());

$("coverArea").querySelector('[data-action="removeCover"]').onclick = () => {
    coverData = "";
    $("coverPreview").hidden = true;
    $("coverPreview").src = "";
    $("coverPlaceholder").style.display = "flex";
    markUnsaved();
};

$("coverFile").onchange = () => {
    let f = $("coverFile").files[0];
    if (f) {
        coverData = URL.createObjectURL(f);
        $("coverPreview").src = coverData;
        $("coverPreview").hidden = false;
        $("coverPlaceholder").style.display = "none";
        markUnsaved();
    }
};

$("coverUpload").addEventListener("dragover", e => {
    e.preventDefault();
    $("coverUpload").classList.add("drag");
});

$("coverUpload").addEventListener("dragleave", () => $("coverUpload").classList.remove("drag"));

$("coverUpload").addEventListener("drop", e => {
    e.preventDefault();
    $("coverUpload").classList.remove("drag");
    let f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
        coverData = URL.createObjectURL(f);
        $("coverPreview").src = coverData;
        $("coverPreview").hidden = false;
        $("coverPlaceholder").style.display = "none";
        markUnsaved();
    }
});

// Rascunho
function getState() {
    return { details: { title: $("titleInput").value, category: $("categoryInput").value, area: $("areaInput").value, collaborators: $("collaboratorsInput").value, role: $("roleInput").value, year: $("yearInput").value, process: $("processInput").value }, tools, skills, blocks: blocks.map(b => ({ ...b, items: (b.items || []).map(it => ({ ...it })) })), cover: coverData };
}

function saveDraft() {
    let state = getState();
    try {
        localStorage.setItem("conectaPortfolioDraft", JSON.stringify(state));
        $("saveStatus").textContent = "Rascunho salvo neste navegador";
        toast("Rascunho salvo neste navegador.");
    }
    catch (e) {
        toast("Não foi possível salvar. Imagens grandes podem exceder o limite do navegador.");
    }
}

$("saveBtn").onclick = saveDraft;

function loadDraft() {
    try {
        let raw = localStorage.getItem("conectaPortfolioDraft");
        if (!raw)
            return;
        let s = JSON.parse(raw);
        Object.entries(s.details || {}).forEach(([k, v]) => {
            let map = { title: "titleInput", category: "categoryInput", area: "areaInput", collaborators: "collaboratorsInput", role: "roleInput", year: "yearInput", process: "processInput" };
            if (map[k] && $(map[k]))
                $(map[k]).value = v;
        });
        tools = s.tools || [];
        skills = s.skills || [];
        blocks = s.blocks || [];
        blockCounter = Math.max(0, ...blocks.map(b => b.id || 0));
        coverData = s.cover || "";
        if (coverData) {
            $("coverPreview").src = coverData;
            $("coverPreview").hidden = false;
            $("coverPlaceholder").style.display = "none";
        }
        renderTags("tools");
        renderTags("skills");
        renderBlocks();
        updateHeader();
        $("saveStatus").textContent = "Rascunho carregado";
    }
    catch (e) {
        console.warn(e);
    }
}

// Visualização do projeto
function preview() {
    let state = getState(), out = $("previewContent");
    out.innerHTML = "";
    let h = document.createElement("h1");
    h.textContent = state.details.title || "Projeto sem título";
    out.append(h);
    if (coverData) {
        let img = document.createElement("img");
        img.className = "preview-cover";
        img.src = coverData;
        out.append(img);
    }
    let meta = document.createElement("p");
    meta.textContent = [state.details.category, state.details.area, state.details.year].filter(Boolean).join(" · ");
    out.append(meta);
    blocks.forEach(b => {
        let sec = document.createElement("section");
        sec.className = "preview-block";
        let title = document.createElement("h3");
        title.textContent = b.title;
        sec.append(title);
        if (b.type === "about") {
            b.fields.forEach(f => {
                let p = document.createElement("p");
                p.innerHTML = "<strong>" + esc(f[0]) + ":</strong> " + esc(f[1]);
                sec.append(p);
            });
        }
        else if (b.type === "text" || b.type === "credits") {
            let p = document.createElement("p");
            p.textContent = b.text || "";
            sec.append(p);
        }
        else if (b.items?.length) {
            b.items.forEach(it => {
                let el = it.kind === "video" ? document.createElement("video") : document.createElement("img");
                el.src = it.src;
                el.controls = it.kind === "video";
                el.style.maxWidth = "100%";
                el.style.maxHeight = "300px";
                sec.append(el);
            });
        }
        else if (b.type === "embed" && b.url) {
            let a = document.createElement("a");
            a.href = b.url;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = "Abrir conteúdo incorporado";
            sec.append(a);
        }
        out.append(sec);
    });
    $("previewOverlay").style.display = "grid";
}

$("previewBtn").onclick = preview;

$("publishBtn").onclick = () => {
    if (!$("titleInput").value.trim() || !$("categoryInput").value || !$("areaInput").value) {
        toast("Preencha título, tipo e área antes de publicar.");
        return;
    }
    saveDraft();
    toast("Projeto publicado em modo demonstrativo.");
};

// Fechar janela
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => $(b.dataset.close).style.display = "none");

document.querySelectorAll(".overlay").forEach(o => o.addEventListener("click", e => {
    if (e.target === o)
        o.style.display = "none";
}));

$("detailsForm").addEventListener("input", markUnsaved);
$("processInput").addEventListener("input", markUnsaved);
setupYears();
blocks = defaultBlocks.map(b => ({ ...b, id: ++blockCounter, items: b.items || [] }));
renderBlocks();
loadDraft();
updateHeader();

/* Interações do cabeçalho */
(() => {
    const searchInput = document.getElementById("searchInput");
    const searchContainer = document.getElementById("searchContainer");
    const searchToggle = document.getElementById("searchToggle");
    if (searchToggle && searchContainer && searchInput) {
        searchToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const active = searchContainer.classList.contains("active");
            if (!active) {
                searchContainer.classList.add("active");
                searchToggle.setAttribute("aria-expanded", "true");
                searchInput.focus();
            }
            else if (!searchInput.value.trim()) {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target) && !searchInput.value.trim()) {
                searchContainer.classList.remove("active");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

})();
