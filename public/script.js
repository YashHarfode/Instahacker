document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Login details submitted successfully!");
    } else {
      alert("Error submitting login details.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred. Please try again.");
  }
});
