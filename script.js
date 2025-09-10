document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // 默认显示 Registrierung
  showRegistrationForm();

  document.getElementById("nav-register").addEventListener("click", showRegistrationForm);
  document.getElementById("nav-overview").addEventListener("click", showOverview);

  function showRegistrationForm() {
    app.innerHTML = `
      <h2>Registrierung</h2>
      <form id="donationForm">
        <label>
          Übergabeart:
          <select id="deliveryMethod" required>
            <option value="">Bitte wählen</option>
            <option value="geschaeftsstelle">Geschäftsstelle</option>
            <option value="abholung">Abholung</option>
          </select>
        </label>
        <br><br>
        <label>
          Kleidungstypen:
          <input type="checkbox" value="Jacken"> Jacken
          <input type="checkbox" value="Hosen"> Hosen
          <input type="checkbox" value="Schuhe"> Schuhe
        </label>
        <br><br>
        <label>
          Krisengebiet:
          <select id="crisisRegion" required>
            <option value="">Bitte wählen</option>
            <option value="Afrika">Afrika</option>
            <option value="Asien">Asien</option>
            <option value="Europa">Europa</option>
          </select>
        </label>
        <br><br>
        <div id="addressFields" style="display:none;">
          <label>Straße: <input type="text" id="street"></label><br>
          <label>Stadt: <input type="text" id="city"></label><br>
          <label>PLZ: <input type="text" id="postalCode"></label><br>
        </div>
        <br>
        <button type="submit">Absenden</button>
      </form>
    `;

    const deliveryMethod = document.getElementById("deliveryMethod");
    deliveryMethod.addEventListener("change", () => {
      const addressFields = document.getElementById("addressFields");
      if (deliveryMethod.value === "abholung") {
        addressFields.style.display = "block";
      } else {
        addressFields.style.display = "none";
      }
    });

    const form = document.getElementById("donationForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Formular erfolgreich abgeschickt! (hier kommt später die Bestätigungsseite)");
    });
  }

  function showOverview() {
    app.innerHTML = `
      <h2>Übersicht</h2>
      <p>Hier werden später die gespeicherten Registrierungen angezeigt.</p>
    `;
  }
});
