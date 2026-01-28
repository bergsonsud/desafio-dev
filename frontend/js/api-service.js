const ApiService = (() => {
    const BASE_URL = "/api/v1";

    async function request(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers
                }
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw {
                    status: response.status,
                    message: "Resposta inválida do servidor"
                };
            }

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.error || "Erro na requisicao",
                    data
                };
            }

            return { ok: true, data, status: response.status };
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: "Erro de conexao com o servidor",
                originalError: error
            };
        }
    }


    async function getTransactions() {
        return request("/transactions");
    }

    async function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        return request("/upload", {
            method: "POST",
            body: formData
        });
    }

    return {
        getTransactions,
        uploadFile,
        request
    };
})();

/* istanbul ignore next */
if (typeof module !== "undefined" && module.exports) {
    module.exports = ApiService;
}

/* istanbul ignore next */
if (typeof window !== "undefined" && typeof module === "undefined") {
    window.ApiService = ApiService;
}
