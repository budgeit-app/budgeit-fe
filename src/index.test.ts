import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { main, onSubmit } from "./index";

describe("Expense tracker", () => {
  let formEl: HTMLFormElement,
    tableEl: HTMLTableElement,
    categoryInputEl: HTMLInputElement,
    amountInputEl: HTMLInputElement;

  beforeEach(() => {
    formEl = document.createElement("form");
    tableEl = document.createElement("table");

    categoryInputEl = document.createElement("input");
    categoryInputEl.setAttribute("name", "category");
    formEl.appendChild(categoryInputEl);

    amountInputEl = document.createElement("input");
    amountInputEl.setAttribute("name", "amount");
    formEl.appendChild(amountInputEl);
  });

  function setFormValues(category: string | null, amount: number | null) {
    if (typeof category === "string") {
      categoryInputEl.value = category;
    }

    if (typeof amount === "number") {
      amountInputEl.value = String(amount);
    }
  }

  describe("main", () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    afterEach(() => {
      document.body.innerHTML = "";
      consoleErrorSpy.mockReset();
    });

    function submit() {
      const submitEvent = new CustomEvent("submit");
      formEl.dispatchEvent(submitEvent);
    }

    test("updates the table on submit", () => {
      formEl.id = "form";
      tableEl.id = "table";

      document.body.appendChild(formEl);
      document.body.appendChild(tableEl);

      main();

      setFormValues("Bills", 24);
      submit();

      expect(tableEl.querySelectorAll("tr")).lengthOf(1);
    });

    test("logs error when form element is missing", () => {
      tableEl.id = "table";
      document.body.appendChild(tableEl);

      main();
      setFormValues("Bills", 24);
      submit();

      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith("Form not found");
    });

    test("logs error when table element is missing", () => {
      formEl.id = "form";
      document.body.appendChild(formEl);

      main();
      setFormValues("Bills", 24);
      submit();

      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith("Form not found");
    });
  });

  describe("onSubmit", () => {
    let e: SubmitEvent;

    beforeEach(() => {
      e = new SubmitEvent("submit");
    });

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

    test("throws error when category is missing", () => {
      setFormValues(null, 1);

      expect(() => submit()).toThrowError("Invalid category or amount");
    });

    test("throws error when amount is missing", () => {
      setFormValues("Utilities", null);

      expect(() => submit()).toThrowError("Invalid category or amount");
    });
  });
});
