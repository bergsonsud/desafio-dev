document.getElementById("upload-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  let fileInput = document.getElementById("file");
  let file = fileInput.files[0];
  if (!file) {
    alert("Selecione um arquivo!");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);

  let response = await fetch("http://localhost/api/v1/upload", {
    method: "POST",
    body: formData
  });

  let result = await response.json();
  alert(result.message);

  setTimeout(() => {
    window.location.reload();
  }, 2000);


});
