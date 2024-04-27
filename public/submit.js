const submit = document.querySelector(".submit");
const input = document.querySelector(".text-input");

submit.addEventListener("click", async function submitClick() {
  const data = { val: input.value };
  const word = data.val;
  const paragraph = document.querySelector(".p-msg");
  paragraph.classList.remove("p-green");

  const timeOutFunction = () => {
    setTimeout(() => {
      paragraph.textContent = "";
    }, 1500);
    input.value = "";
  };

  if (word.split("").length !== 5) {
    paragraph.textContent = "Your word is not of length 5. Please try again.";
    timeOutFunction();
    return;
  }

  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );

  if (response.status === 404) {
    paragraph.textContent = "Your word is not valid. Please try again.";
    timeOutFunction();
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const msg = await fetch("/submit", options);

  console.log("2", msg);

  if (!msg.ok) {
    return console.log("Error!");
  }

  const jsonResponse = await msg.json();
  console.log("hi", jsonResponse.code);

  if (jsonResponse.code === "ADDED") paragraph.classList.add("p-green");
  const resultMessage = jsonResponse.msg;
  paragraph.textContent = resultMessage;
  timeOutFunction();
});
