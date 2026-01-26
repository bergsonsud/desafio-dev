function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function loadTransactions() {
    const tableBody = document.querySelector("#transactions-table tbody");
    const loading = document.getElementById("loading");
    const emptyState = document.getElementById("empty-state");
    const table = document.getElementById("transactions-table");

    loading.classList.remove("hidden");
    table.classList.add("hidden");
    emptyState.classList.add("hidden");

    try {
        const { data: stores } = await ApiService.getTransactions();

        loading.classList.add("hidden");
        tableBody.innerHTML = "";

        if (!stores || stores.length === 0) {
            emptyState.classList.remove("hidden");
            table.classList.add("hidden");
            return;
        }

        table.classList.remove("hidden");

        stores.forEach(store => {
            const balance = parseFloat(store.balance) || 0.0;
            const balanceClass = balance >= 0 ? "text-green-600" : "text-red-600";
            const balanceFormatted = balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            const storeRow = document.createElement("tr");
            storeRow.className = "bg-gray-50";
            storeRow.innerHTML = `
                <td colspan="5" class="px-6 py-4">
                    <strong class="flex justify-between items-center">
                        <span class="text-gray-800 text-lg">${escapeHtml(store.store_name)}</span>
                        <span class="${balanceClass} text-lg font-bold">Saldo: ${balanceFormatted}</span>
                    </strong>
                </td>
            `;
            tableBody.appendChild(storeRow);

            if (store.transactions && store.transactions.length > 0) {
                store.transactions.forEach(tx => {
                    const value = parseFloat(tx.value) || 0.0;
                    const valueSigned = parseFloat(tx.value_sign) || 0.0;
                    const valueClass = valueSigned >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold";
                    const typeClass = valueSigned >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

                    const row = document.createElement("tr");
                    row.className = "hover:bg-gray-50 transition-colors";
                    row.innerHTML = `
                        <td class="px-6 py-4 text-gray-700">${escapeHtml(store.store_name)}</td>
                        <td class="px-6 py-4">
                            <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full ${typeClass}">
                                ${escapeHtml(tx.description)}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right text-gray-700 font-medium">${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                        <td class="px-6 py-4 text-right ${valueClass}">${valueSigned.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                        <td class="px-6 py-4 text-gray-700">${new Date(tx.date).toLocaleDateString("pt-BR")}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                const emptyRow = document.createElement("tr");
                emptyRow.innerHTML = `<td colspan="5" class="px-6 py-8 text-center text-gray-500">Nenhuma transacao disponivel</td>`;
                tableBody.appendChild(emptyRow);
            }
        });
    } catch (error) {
        loading.classList.add("hidden");
        emptyState.classList.remove("hidden");
        console.error("Erro ao carregar transacoes:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadTransactions();

    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadTransactions);
    }
});
