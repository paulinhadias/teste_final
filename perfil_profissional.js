(() => {
    "use strict";

    // Busca cabeçalho
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

    // Navegação
    const sectionLinks = document.querySelectorAll(".section-nav a");
    sectionLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sectionLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Modal geral
    const backdrop = document.getElementById("modalBackdrop");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalClose = document.getElementById("modalClose");

    function openModal(title, content) {
        if (!backdrop) return;
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        backdrop.classList.add("open");
        backdrop.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        if (!backdrop) return;
        backdrop.classList.remove("open");
        backdrop.setAttribute("aria-hidden", "true");
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (backdrop) {
        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) closeModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
            closeAllActionMenus();
        }
    });

    // Editar foto de perfil
    const editPhotoBtn = document.getElementById("editPhotoBtn");
    const heroPhoto = document.getElementById("heroPhoto");

    function openPhotoModal() {
        openModal(
            "Editar foto de perfil",
            `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 0 0;">
                <p style="margin: 0; color: #45525a; font-size: 13px; text-align: left; width: 100%;">
                    Escolha uma imagem para deixar seu perfil com a sua identidade.
                </p>

                <div style="
                    width: 110px;
                    height: 110px;
                    background: #e4ecec;
                    border: 1px solid #d0dfdf;
                    border-radius: 16px;
                    display: grid;
                    place-items: center;
                    color: #168c87;
                    font-size: 26px;
                    font-weight: 700;
                    margin: 4px 0;
                ">
                    <span>LS</span>
                </div>

                <div style="
                    width: 100%;
                    border: 1px solid #dce4e8;
                    border-radius: 8px;
                    padding: 8px 12px;
                    box-sizing: border-box;
                    background: #ffffff;
                ">
                    <input type="file" accept="image/*" id="modalFileInput" style="font-size: 12px; color: #45525a; width: 100%;">
                </div>

                <div style="width: 100%; display: flex; justify-content: flex-start; margin-top: 4px;">
                    <button type="button" id="saveModalPhotoBtn" style="
                        background: #168c87;
                        color: #ffffff;
                        border: none;
                        border-radius: 6px;
                        padding: 10px 18px;
                        font-size: 13px;
                        font-weight: 700;
                        cursor: pointer;
                    ">Salvar foto</button>
                </div>
            </div>
            `
        );

        setTimeout(() => {
            const saveModalPhotoBtn = document.getElementById("saveModalPhotoBtn");
            const modalFileInput = document.getElementById("modalFileInput");

            if (saveModalPhotoBtn) {
                saveModalPhotoBtn.addEventListener("click", () => {
                    if (modalFileInput && modalFileInput.files && modalFileInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if (heroPhoto) {
                                heroPhoto.innerHTML = `<img src="${e.target.result}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">`;
                            }
                        };
                        reader.readAsDataURL(modalFileInput.files[0]);
                    }
                    closeModal();
                });
            }
        }, 50);
    }

    if (editPhotoBtn) editPhotoBtn.addEventListener("click", openPhotoModal);
    if (heroPhoto) heroPhoto.addEventListener("click", openPhotoModal);

    // Menu de ações
    function closeAllActionMenus() {
        document.querySelectorAll(".edit-dropdown").forEach((menu) => menu.remove());
    }

    document.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const parent = button.closest(".panel");
            const existingMenu = parent.querySelector(".edit-dropdown");
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            closeAllActionMenus();

            const sectionName = button.dataset.edit;

            const menu = document.createElement("div");
            menu.className = "edit-dropdown";
            menu.style.cssText = `
                position: absolute;
                top: 36px;
                right: 12px;
                background: #ffffff;
                border: 1px solid #e5ebed;
                border-radius: 8px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
                padding: 6px;
                display: flex;
                flex-direction: column;
                gap: 2px;
                z-index: 50;
                min-width: 150px;
            `;

            menu.innerHTML = `
                <button type="button" class="action-btn edit-action" style="
                    background: transparent;
                    border: none;
                    padding: 8px 12px;
                    text-align: left;
                    font-size: 12px;
                    color: #252b35;
                    cursor: pointer;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">✏ Editar informações</button>
                <button type="button" class="action-btn delete-action" style="
                    background: transparent;
                    border: none;
                    padding: 8px 12px;
                    text-align: left;
                    font-size: 12px;
                    color: #d93838;
                    cursor: pointer;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">🗑 Excluir informações</button>
            `;

            menu.querySelectorAll(".action-btn").forEach((btn) => {
                btn.addEventListener("mouseenter", () => {
                    btn.style.background = btn.classList.contains("delete-action") ? "#fde8e8" : "#edf6f5";
                });
                btn.addEventListener("mouseleave", () => {
                    btn.style.background = "transparent";
                });
            });

            // Editar informações
            menu.querySelector(".edit-action").addEventListener("click", () => {
                menu.remove();
                const contentBox = parent.querySelector(".editable-content") || parent.querySelector("p, dl, .education-columns, .item-list, .skill-tags");
                const currentText = contentBox ? contentBox.innerHTML : "";

                openModal(`Editar — ${sectionName}`, `
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="font-weight: 700; font-size: 13px; color: #252b35;">Modificar conteúdo:</label>
                        <textarea id="editTextarea" style="width: 100%; height: 140px; padding: 10px; border: 1px solid #dce4e8; border-radius: 8px; font-size: 13px; font-family: inherit; box-sizing: border-box; resize: vertical;">${currentText.trim()}</textarea>
                        <button type="button" id="saveEditTextBtn" style="background: #168c87; color: #fff; border: none; border-radius: 6px; padding: 10px 16px; font-weight: 700; cursor: pointer; align-self: flex-start;">Salvar alterações</button>
                    </div>
                `);

                setTimeout(() => {
                    const saveBtn = document.getElementById("saveEditTextBtn");
                    const textarea = document.getElementById("editTextarea");
                    if (saveBtn && textarea && contentBox) {
                        saveBtn.addEventListener("click", () => {
                            contentBox.innerHTML = textarea.value;
                            closeModal();
                        });
                    }
                }, 50);
            });

            // Excluir textos
            menu.querySelector(".delete-action").addEventListener("click", () => {
                menu.remove();
                if (confirm(`Deseja excluir as informações de "${sectionName}"?`)) {
                    const contentBox = parent.querySelector(".editable-content") || parent.querySelector("p, dl, .education-columns, .item-list, .skill-tags");
                    if (contentBox) {
                        contentBox.innerHTML = "<p style='color: #8a959c; font-style: italic; margin: 0;'>Nenhuma informação cadastrada.</p>";
                    }
                }
            });

            parent.appendChild(menu);
        });
    });

    document.addEventListener("click", closeAllActionMenus);

})();
