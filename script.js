document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // 默认显示 Registrierung
  showRegistrationForm();

  document.getElementById("nav-register").addEventListener("click", showRegistrationForm);
  document.getElementById("nav-overview").addEventListener("click", showOverview);

  function sanitize(input) {
    if (typeof input !== "string") return input;
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }


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
        <div id="errorBox"></div>
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
        const errors = [];
        const method = document.getElementById("deliveryMethod").value;
        const crisisRegion = document.getElementById("crisisRegion").value;

        // Kleidungstypen sammeln
        const clothingTypes = Array.from(
            form.querySelectorAll("input[type=checkbox]:checked")
        ).map(cb => cb.value);

        if (!method) {
            errors.push("Bitte wählen Sie eine Übergabeart.");
        }
        if (clothingTypes.length === 0) {
            errors.push("Bitte wählen Sie mindestens einen Kleidungstyp.");
        }
        if (!crisisRegion) {
            errors.push("Bitte wählen Sie ein Krisengebiet.");
        }

        let street = "", city = "", postalCode = "";
        if (method === "abholung") {
            street = document.getElementById("street").value.trim();
            city = document.getElementById("city").value.trim();
            postalCode = document.getElementById("postalCode").value.trim();

            if (!street || !city || !postalCode) {
            errors.push("Adresse (Straße, Stadt, PLZ) ist erforderlich.");
            }
            if (!/^\d{5}$/.test(postalCode)) {
            errors.push("Die Postleitzahl muss 5-stellig sein.");
            }
            // Beispiel: Geschäftsstelle hat PLZ 64289 → '64'
            const basePrefix = "64";
            if (postalCode.slice(0, 2) !== basePrefix) {
            errors.push("Abholung nur im gleichen Postleitzahlbereich (64xxx) möglich.");
            }
        }

        // Fehlermeldungen anzeigen oder Bestätigung
        const errorBox = document.getElementById("errorBox");
        if (errors.length > 0) {
            errorBox.innerHTML = errors.map(e => `<p style="color:red">${e}</p>`).join("");
            return;
        }

        // Datum + Uhrzeit automatisch hinzufügen
        const now = new Date();
        const datum = now.toLocaleDateString("de-DE");
        const uhrzeit = now.toLocaleTimeString("de-DE");

        // Registrierung-Objekt
        const registration = {
            clothingTypes,
            crisisRegion,
            method,
            street,
            city,
            postalCode,
            datum,
            uhrzeit
        };

        // Bestehende Einträge holen und speichern
        const existing = JSON.parse(localStorage.getItem("registrations") || "[]");
        existing.push(registration);
        localStorage.setItem("registrations", JSON.stringify(existing));


        // Bestätigungsseite anzeigen
        app.innerHTML = `
            <h2>Bestätigung</h2>
            <p><strong>Kleidungstypen:</strong> ${clothingTypes.map(sanitize).join(", ")}</p>
            <p><strong>Krisengebiet:</strong> ${sanitize(crisisRegion)}</p>
            <p><strong>Übergabeart:</strong> ${method === "geschaeftsstelle" ? "Geschäftsstelle" : "Abholung"}</p>
            ${method === "abholung" ? `<p><strong>Adresse:</strong> ${sanitize(street)}, ${sanitize(city)}, ${sanitize(postalCode)}</p>` : ""}
            <p><strong>Datum:</strong> ${sanitize(datum)}</p>
            <p><strong>Uhrzeit:</strong> ${sanitize(uhrzeit)}</p>
            <button id="backBtn">Neue Registrierung</button>
        `;

        document.getElementById("backBtn").addEventListener("click", showRegistrationForm);
    });
  }

  function showOverview() {
    const data = JSON.parse(localStorage.getItem("registrations") || "[]");
    let filterOptions = `
        <label>Krisengebiet filtern:
        <select id="filterRegion">
            <option value="">Alle</option>
            <option value="Afrika">Afrika</option>
            <option value="Asien">Asien</option>
            <option value="Europa">Europa</option>
        </select>
        </label>
    `;

    let table = `
        <table border="1" cellpadding="5" cellspacing="0">
        <thead>
            <tr>
            <th>Kleidungstypen</th>
            <th>Krisengebiet</th>
            <th>Übergabeart</th>
            <th>Adresse</th>
            <th>Datum</th>
            <th>Uhrzeit</th>
            </tr>
        </thead>
        <tbody id="tableBody">
            ${renderTableRows(data)}
        </tbody>
        </table>
    `;

    app.innerHTML = `
        <h2>Übersicht</h2>
        ${filterOptions}
        ${data.length === 0 ? "<p>Noch keine Registrierungen vorhanden.</p>" : table}
    `;

    const filterSelect = document.getElementById("filterRegion");
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
        const selected = filterSelect.value;
        const filtered = selected ? data.filter(r => r.crisisRegion === selected) : data;
        document.getElementById("tableBody").innerHTML = renderTableRows(filtered);
        });
    }
    }

    function renderTableRows(data) {
    return data.map(r => `
        <tr>
            <td>${r.clothingTypes.map(sanitize).join(", ")}</td>
            <td>${sanitize(r.crisisRegion)}</td>
            <td>${r.method === "geschaeftsstelle" ? "Geschäftsstelle" : "Abholung"}</td>
            <td>${r.method === "abholung" ? `${sanitize(r.street)}, ${sanitize(r.city)}, ${sanitize(r.postalCode)}` : "-"}</td>
            <td>${sanitize(r.datum)}</td>
            <td>${sanitize(r.uhrzeit)}</td>
        </tr>
    `).join("");
  }
});
