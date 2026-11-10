(() => {
    "use strict";

    const profileMenu = document.getElementById("profileMenu");
    const profileToggle = document.getElementById("profileToggle");
    if (!profileMenu || !profileToggle) return;

    const fechar = () => {
        profileMenu.classList.remove("open");
        profileToggle.setAttribute("aria-expanded", "false");
    };

    // Abre / fecha o menu ao clicar no avatar
    profileToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const aberto = profileMenu.classList.toggle("open");
        profileToggle.setAttribute("aria-expanded", String(aberto));
    });

    // Fecha ao clicar fora do menu
    document.addEventListener("click", (event) => {
        if (!profileMenu.contains(event.target)) fechar();
    });

    // Fecha com a tecla Esc
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") fechar();
    });
})();
