async function loadTransactions() {
  try {
    let response = await fetch("http://localhost/api/v1/transactions");
    let stores = await response.json();

    let tableBody = document.querySelector("#transactions-table tbody");
    tableBody.innerHTML = "";

    stores.forEach(store => {
      let balance = parseFloat(store.balance) || 0.0;

      let storeRow = `<tr class="store-row">
                <td colspan="5"><strong>${store.store_name} - Saldo: R$ ${balance.toFixed(2)}</strong></td>
            </tr>`;
      tableBody.innerHTML += storeRow;

      if (store.transactions && store.transactions.length > 0) {
        store.transactions.forEach(tx => {
          let value = parseFloat(tx.value) || 0.0;
          let valueSigned = parseFloat(tx.value_sign) || 0.0;

          let row = `<tr>
                        <td>${store.store_name}</td>
                        <td>${tx.description}</td>
                        <td>${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                        <td>${valueSigned.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                        <td>${new Date(tx.date).toLocaleDateString()}</td>
                    </tr>`;
          tableBody.innerHTML += row;
        });
      } else {
        let emptyRow = `<tr><td colspan="3">Nenhuma transação disponível</td></tr>`;
        tableBody.innerHTML += emptyRow;
      }
    });
  } catch (error) {
    console.error("Erro ao carregar transações:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadTransactions);
