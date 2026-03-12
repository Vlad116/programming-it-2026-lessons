const validateData = (data) => {
  if (!data.name || data.name.length < 3) return false;
  if (data.message.length < 50) return false;

  return true;
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded callback!");
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Останавливаем перезагрузку страницы по submit

    const fieldsElements = form.getElementsByClassName("field");
    // console.log(fieldsElements);

    const data = {
      name: form.querySelector("#name")?.value.trim() || "",
      email: form.querySelector("#email")?.value.trim() || "",
      phone: form.querySelector("#phone")?.value.trim() || "",
      message: form.querySelector("#message")?.value.trim() || "",
    };
    console.log(data);

    let isValid = validateData(data);
    const formValidateResult = form.querySelector(
      ".contact-form_sending-result",
    );
    console.log(formValidateResult);

    // Вариант с добавлением / удалением созданных в скрипте элементов на страницу для отображения сообщения пользователю
    // if (!isValid) {
    //   const formError = document.createElement("div");
    //   formError.className = "errorText";
    //   formError.textContent = "При обработке формы произошла ошибка ❌!";

    //   formValidateResult.appendChild(formError);

    //   setTimeout(() => formError.remove(), 5000);
    //   return;
    // }

    // const successMsg = document.createElement("div");
    // successMsg.className = "successText";
    // successMsg.textContent = `✅ Спасибо, ${data.name}! Ваше сообщение было отправлено`;

    // formValidateResult.append(successMsg);
    // form.after(successMsg);

    // Вариант с использованием существующего элемента "контейнера" на странице для отображения сообщения пользователю
    if (!isValid) {
      formValidateResult.classList.add("errorText", "show");
      formValidateResult.classList.remove("hidden");
      formValidateResult.textContent =
        "При обработке формы произошла ошибка ❌!";

      setTimeout(() => {
        formValidateResult.textContent = "";
        formValidateResult.classList.toggle("hidden");
      }, 5000);
      return;
    }

    formValidateResult.textContent = `✅ Спасибо, ${data.name}! Ваше сообщение было отправлено`;
    formValidateResult.classList.add("successText");

    if (formValidateResult.classList.contains("errorText")) {
      formValidateResult.classList.remove("errorText");
    }

    if (formValidateResult.classList.contains("hidden")) {
      formValidateResult.classList.toggle("hidden");
      formValidateResult.classList.toggle("show");
    }

    form.reset();
  });
});
