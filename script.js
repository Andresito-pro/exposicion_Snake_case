document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Progress Bar Logic
    const progressBar = document.getElementById("progress-bar");
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Scroll Animations (Intersection Observer)
    const reveals = document.querySelectorAll(".reveal");
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target); 
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 3. Navbar Active State
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 4. PEP 8 Interactive Simulator
    const simInput = document.getElementById("sim-input");
    const simResult = document.getElementById("sim-result");

    // Regular Expressions for Case Styles
    const snakeCaseRegex = /^[a-z_][a-z0-9_]*$/;
    const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
    const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
    const screamingSnakeRegex = /^[A-Z_][A-Z0-9_]*$/;

    simInput.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        
        // Reset Box
        simResult.className = "result-box";
        simResult.innerHTML = "";

        if (value === "") {
            simResult.innerHTML = "<p>Esperando entrada...</p>";
            return;
        }

        let message = "";
        let statusClass = "";

        if (screamingSnakeRegex.test(value) && value.includes("_")) {
            statusClass = "success";
            message = `
                <p>Estilo detectado: <strong>SCREAMING_SNAKE_CASE</strong></p>
                <p>✅ Cumple PEP 8: Excelente para declarar <strong>Constantes</strong>.</p>
            `;
        } else if (snakeCaseRegex.test(value)) {
            statusClass = "success";
            message = `
                <p>Estilo detectado: <strong>snake_case</strong></p>
                <p>✅ Cumple PEP 8: Ideal para <strong>variables y funciones</strong>.</p>
            `;
        } else if (pascalCaseRegex.test(value)) {
            statusClass = "info";
            message = `
                <p>Estilo detectado: <strong>PascalCase (UpperCamelCase)</strong></p>
                <p>✅ Cumple PEP 8: Válido exclusivamente para declarar <strong>Clases</strong>.</p>
            `;
        } else if (camelCaseRegex.test(value) && /[A-Z]/.test(value)) {
            statusClass = "warning";
            // Convert camelCase to snake_case for the suggestion
            const suggestion = value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            message = `
                <p>Estilo detectado: <strong>camelCase</strong></p>
                <p>❌ No recomendado en Python para funciones ni variables (A menos que adaptes librerías externas).</p>
                <p class="suggestion">Sugerencia PEP 8: ${suggestion}</p>
            `;
        } else {
            statusClass = "warning";
            message = `
                <p>Formato no reconocido o mixto.</p>
                <p>Asegúrate de no usar caracteres especiales o espacios.</p>
            `;
        }

        simResult.classList.add(statusClass);
        simResult.innerHTML = message;
    });
});