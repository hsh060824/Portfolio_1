(() => {
    const html = document.documentElement;
    const navToggle = document.querySelector(".nav-toggle");
    const navList = document.querySelector(".site-nav ul");
    const navLinks = document.querySelectorAll(".site-nav a");
    const themeToggle = document.getElementById("theme-toggle");
    const filterGroups = document.querySelectorAll(".filter-group");
    const yearEl = document.getElementById("year");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    let manualTheme = localStorage.getItem("theme");

    const applyTheme = (theme, persist = true) => {
        if (!theme) return;
        html.setAttribute("data-theme", theme);
        if (persist) {
            localStorage.setItem("theme", theme);
            manualTheme = theme;
        }
    };

    if (manualTheme) {
        applyTheme(manualTheme);
    } else if (prefersDark.matches) {
        applyTheme("dark", false);
    } else {
        applyTheme(html.getAttribute("data-theme") || "light", false);
    }

    prefersDark.addEventListener("change", (event) => {
        if (!manualTheme) {
            applyTheme(event.matches ? "dark" : "light", false);
        }
    });

    themeToggle?.addEventListener("click", () => {
        const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });

    navToggle?.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        navList?.classList.toggle("open", !expanded);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navToggle?.setAttribute("aria-expanded", "false");
            navList?.classList.remove("open");
        });
    });

    // Intersection observer to highlight nav links based on scroll
    const sections = [...document.querySelectorAll("main section[id]")];
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        },
        {
            rootMargin: "-55% 0px -40% 0px",
            threshold: 0.1,
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // Reveal animation on scroll
    const revealElements = document.querySelectorAll(".hero-content, .hero-card, .card, .timeline-card, .badge-card, .contact-card");
    revealElements.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // Filter controls
    filterGroups.forEach((group) => {
        const buttons = group.querySelectorAll(".filter-button");

        let container = group.nextElementSibling;
        while (container && !container.classList.contains("timeline") && !container.classList.contains("masonry")) {
            container = container.nextElementSibling;
        }

        if (!container) return;

        const cards = container.children;

        buttons.forEach((button) => {
            button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
            button.addEventListener("click", () => {
                buttons.forEach((btn) => {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-pressed", "false");
                });
                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");

                const filter = button.dataset.filter ?? "all";
                Array.from(cards).forEach((card) => {
                    const categories = card.dataset.category?.split(" ") ?? [];
                    const isVisible = filter === "all" || categories.includes(filter);
                    card.classList.toggle("hidden", !isVisible);
                });
            });
        });
    });

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear().toString();
    }
})();
