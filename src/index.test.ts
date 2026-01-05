import { beforeEach, describe, expect, test, vi } from "vitest";
import { onSubmit } from "./index";

describe("onSubmit", () => {
  let e: SubmitEvent;
  let formEl: HTMLFormElement,
    tableEl: HTMLTableElement,
    categoryInputEl: HTMLInputElement,
    amountInputEl: HTMLInputElement;

  beforeEach(() => {
    e = new SubmitEvent("");

    formEl = document.createElement("form");
    tableEl = document.createElement("table");

    categoryInputEl = document.createElement("input");
    categoryInputEl.setAttribute("name", "category");
    formEl.appendChild(categoryInputEl);

    amountInputEl = document.createElement("input");
    amountInputEl.setAttribute("name", "amount");
    formEl.appendChild(amountInputEl);
  });

  function setFormValues(category: string, amount: number) {
    categoryInputEl.value = category;
    amountInputEl.value = String(amount);
  }

  function submit() {
    onSubmit(e, formEl, tableEl);
  }

  test("prevents default on the submit event", () => {
    setFormValues("Groceries", 12);
    const preventDefaultSpy = vi.spyOn(e, "preventDefault");
    submit();

    expect(preventDefaultSpy).toHaveBeenCalledOnce();
  });

  test("appends a new row to the table", () => {
    setFormValues("Bills", 24);
    submit();

    const rows = tableEl.querySelectorAll("tr");
    expect(rows).lengthOf(1);

    const [categoryCellEl, amountCellEl] = Array.from(
      rows[0].querySelectorAll("td"),
    );
    expect(categoryCellEl.innerText).toBe("Bills");
    expect(amountCellEl.innerText).toBe("24$");
  });

  test("resets the form values", () => {
    setFormValues("Car repayment", 400);
    submit();

    expect(categoryInputEl.value).toBe("");
    expect(amountInputEl.value).toBe("");
  });
});
