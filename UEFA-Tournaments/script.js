window.addEventListener("load", function() {
            const loader = document.getElementById("preloader");
            setTimeout(() => {
                loader.classList.add("loader-hidden");
            }, 600);
        });