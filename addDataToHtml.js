document.addEventListener("DOMContentLoaded", function (event) {
  let users = [];

  let currentPage = 1;
  let currentPageSize = 10;

  renderData();
  renderUsersPage(1);
  initPagination();

  function renderData() {
    fetch("/data")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("failed to load");
        }
      })
      .then((data) => {
        users = data;
        renderUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function initPagination() {
    let pagination = document.querySelector(".pagination");
    pagination.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.dataset.page === "prew") {
        if (currentPage === 1) {
          currentPage = currentPage;
        } else {
          currentPage = currentPage - 1;
          renderUsersPage(parseInt(currentPage));
        }
      } else if (e.target.dataset.page === "next") {
        if (currentPage === 3) {
          currentPage = currentPage;
        } else {
          currentPage = currentPage + 1;
          renderUsersPage(parseInt(currentPage));
        }
      } else {
        currentPage = e.target.dataset.page;
        renderUsersPage(parseInt(currentPage));
      }
    });
  }

  function renderUsersPage(pageNum) {
    currentPage = pageNum;
    renderUsers();
  }

  function renderUsers() {
    let template = document.querySelector(".template");
    let tr = document.querySelectorAll(".tr-template");
    tr.forEach((el) => {
      el.innerHTML = "";
    });

    let firstIndex = currentPage * currentPageSize - currentPageSize;
    let lastIndex = currentPage * currentPageSize;

    let data = users.slice(firstIndex, lastIndex);

    for (let i = 0; i < data.length; i++) {
      let td = template.content.querySelectorAll("td");
      let clone = document.importNode(template.content, true);

      Object.keys(data[i]).forEach((key) => {
        clone.querySelector("." + key).textContent = data[i][key];
      });
      let table = document.querySelector(".data");
      table.appendChild(clone);
    }
  }
});
