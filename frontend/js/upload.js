document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file");
    const fileName = document.getElementById("file-name");
    const uploadStatus = document.getElementById("upload-status");
    const form = document.getElementById("upload-form");

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
        } else {
            fileName.textContent = "";
        }
    });

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            showStatus("Selecione um arquivo!", "error");
            return;
        }

        if (!file.name.endsWith(".txt")) {
            showStatus("Por favor, selecione um arquivo .txt", "error");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showStatus("Arquivo muito grande. Máximo: 10MB", "error");
            return;
        }

        try {
            const { data: result } = await ApiService.uploadFile(file);

            showStatus(result.message, "success");
            fileInput.value = "";
            fileName.textContent = "";
            setTimeout(() => {
                if (typeof loadTransactions === "function") {
                    loadTransactions();
                }
            }, 1000);
        } catch (error) {
            const message = error.message || "Erro ao processar arquivo";
            showStatus(message, "error");
            console.error("Erro ao fazer upload:", error);
        }
    });

    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.classList.remove("hidden", "bg-green-100", "text-green-800", "bg-red-100", "text-red-800");
        
        if (type === "success") {
            uploadStatus.classList.add("bg-green-100", "text-green-800", "border", "border-green-300");
        } else {
            uploadStatus.classList.add("bg-red-100", "text-red-800", "border", "border-red-300");
        }
        
        setTimeout(() => {
            uploadStatus.classList.add("hidden");
        }, 5000);
    }
});
