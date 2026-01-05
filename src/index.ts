export function onSubmit(
  e: SubmitEvent,
  formEl: HTMLFormElement,
  tableEl: HTMLTableElement,
) {
  e.preventDefault();

  const formData = new FormData(formEl);
  const category = formData.get("category");
  const amount = formData.get("amount");

  if (!category || !amount) {
    throw new Error("Invalid category or amount");
  }

  const tableRowEl = document.createElement("tr");
  tableRowEl.className = "border-t-solid border-t-1 border-t-neutral-600";

  const categoryTableCellEl = document.createElement("td");
  categoryTableCellEl.innerText = String(category);
  categoryTableCellEl.className =
    "border-r-solid border-r-1 border-r-neutral-600";

  const amountCellEl = document.createElement("td");
  amountCellEl.innerText = `${amount}$`;

  tableRowEl.appendChild(categoryTableCellEl);
  tableRowEl.appendChild(amountCellEl);

  tableEl.appendChild(tableRowEl);

  formEl.reset();
}

export function main() {
  const formEl = document.querySelector<HTMLFormElement>("#form");
  const tableEl = document.querySelector<HTMLTableElement>("#table");

  if (formEl && tableEl) {
    formEl.addEventListener("submit", (e) => onSubmit(e, formEl, tableEl));
  } else {
    console.error("Form not found");
  }
}

main();
