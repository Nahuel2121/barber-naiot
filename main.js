// ============================
// NAIOT BARBERÍA - Main JS
// ============================

const WHATSAPP_NUMBER = "5491166210713";

// ---- Opening hours per day (0=Sunday, 6=Saturday) ----
const HORARIOS = {
  0: null,                           // Domingo: cerrado
  1: { open: "09:00", close: "20:00" }, // Lunes
  2: { open: "09:00", close: "20:00" }, // Martes
  3: { open: "09:00", close: "20:00" }, // Miércoles
  4: { open: "09:00", close: "20:00" }, // Jueves
  5: { open: "09:00", close: "20:00" }, // Viernes
  6: { open: "09:00", close: "18:00" }, // Sábado
};

// ---- DOM Elements ----
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.getElementById("navbar");
const bookingForm = document.getElementById("booking-form");
const successMsg = document.getElementById("success-msg");

// Calendar elements
const fechaInput = document.getElementById("fecha");
const fechaDisplay = document.getElementById("fecha-display");
const fechaText = document.getElementById("fecha-text");
const calendarDropdown = document.getElementById("calendar-dropdown");
const calDays = document.getElementById("cal-days");
const calMonthYear = document.getElementById("cal-month-year");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");

// Time elements
const horaInput = document.getElementById("hora");
const horaDisplay = document.getElementById("hora-display");
const horaText = document.getElementById("hora-text");
const horaDropdown = document.getElementById("hora-dropdown");
const horaSlots = document.getElementById("hora-slots");

// ---- Mobile Menu Toggle ----
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  const icon = menuBtn.querySelector("i");
  if (mobileMenu.classList.contains("hidden")) {
    icon.classList.replace("fa-times", "fa-bars");
  } else {
    icon.classList.replace("fa-bars", "fa-times");
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuBtn.querySelector("i").classList.replace("fa-times", "fa-bars");
  });
});

// ---- Navbar scroll effect ----
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-lg", "shadow-black/30");
    navbar.classList.remove("bg-dark/80");
    navbar.classList.add("bg-dark/95");
  } else {
    navbar.classList.remove("shadow-lg", "shadow-black/30");
    navbar.classList.remove("bg-dark/95");
    navbar.classList.add("bg-dark/80");
  }
});

// ================================================
// CUSTOM CALENDAR DATE PICKER
// ================================================

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

let calCurrentMonth = new Date().getMonth();
let calCurrentYear = new Date().getFullYear();
let selectedDate = null;

function renderCalendar() {
  calDays.innerHTML = "";

  const firstDay = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
  const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  calMonthYear.textContent = `${MONTH_NAMES[calCurrentMonth]} ${calCurrentYear}`;

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("button");
    empty.type = "button";
    empty.classList.add("cal-empty");
    empty.disabled = true;
    calDays.appendChild(empty);
  }

  // Day buttons
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(calCurrentYear, calCurrentMonth, d);
    dateObj.setHours(0, 0, 0, 0);
    const dayOfWeek = dateObj.getDay();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = d;

    // Disable past days
    const isPast = dateObj < today;
    // Disable Sundays (closed)
    const isSunday = dayOfWeek === 0;

    if (isPast || isSunday) {
      btn.disabled = true;
    }

    if (isSunday) {
      btn.classList.add("cal-sunday");
    }

    // Highlight today
    if (dateObj.getTime() === today.getTime()) {
      btn.classList.add("cal-today");
    }

    // Highlight selected
    if (selectedDate && dateObj.getTime() === selectedDate.getTime()) {
      btn.classList.add("cal-selected");
    }

    btn.addEventListener("click", () => {
      selectedDate = dateObj;

      // Format for hidden input (YYYY-MM-DD)
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      fechaInput.value = `${yyyy}-${mm}-${dd}`;

      // Format for display
      const displayDate = dateObj.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "long",
      });
      fechaText.textContent = displayDate;
      fechaText.classList.remove("text-gray-500");
      fechaText.classList.add("text-white");

      // Close calendar
      calendarDropdown.classList.add("hidden");

      // Re-render to update selected highlight
      renderCalendar();

      // Reset time selection when date changes (availability may differ)
      horaInput.value = "";
      horaText.textContent = "Elegí una hora";
      horaText.classList.remove("text-white");
      horaText.classList.add("text-gray-500");

      // Rebuild time slots for new date
      renderTimeSlots();
    });

    calDays.appendChild(btn);
  }
}

// Toggle calendar dropdown
fechaDisplay.addEventListener("click", () => {
  calendarDropdown.classList.toggle("hidden");
  horaDropdown.classList.add("hidden");
});

calPrev.addEventListener("click", () => {
  calCurrentMonth--;
  if (calCurrentMonth < 0) {
    calCurrentMonth = 11;
    calCurrentYear--;
  }
  renderCalendar();
});

calNext.addEventListener("click", () => {
  calCurrentMonth++;
  if (calCurrentMonth > 11) {
    calCurrentMonth = 0;
    calCurrentYear++;
  }
  renderCalendar();
});

// ================================================
// CUSTOM TIME SLOT PICKER
// ================================================

function generateTimeSlots(openTime, closeTime) {
  const slots = [];
  let [h, m] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  while (h < closeH || (h === closeH && m < closeM)) {
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push(time);
    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }
  return slots;
}

function getBookedSlotsForDate(dateStr) {
  const turnos = getTurnos();
  return turnos
    .filter((t) => t.fecha === dateStr)
    .map((t) => t.hora);
}

function renderTimeSlots() {
  horaSlots.innerHTML = "";

  const dateStr = fechaInput.value;
  if (!dateStr) {
    horaSlots.innerHTML = `
      <div class="text-center py-4 text-gray-500 text-sm">
        <i class="fas fa-info-circle mr-1"></i>Primero elegí una fecha
      </div>
    `;
    return;
  }

  const dateObj = new Date(dateStr + "T00:00:00");
  const dayOfWeek = dateObj.getDay();
  const schedule = HORARIOS[dayOfWeek];

  if (!schedule) {
    horaSlots.innerHTML = `
      <div class="text-center py-4 text-red-400 text-sm">
        <i class="fas fa-times-circle mr-1"></i>Cerrado este día
      </div>
    `;
    return;
  }

  const slots = generateTimeSlots(schedule.open, schedule.close);
  const bookedSlots = getBookedSlotsForDate(dateStr);

  if (slots.length === 0) {
    horaSlots.innerHTML = `
      <div class="text-center py-4 text-gray-500 text-sm">
        No hay horarios disponibles
      </div>
    `;
    return;
  }

  slots.forEach((time) => {
    const slot = document.createElement("div");
    slot.classList.add("time-slot");

    const isTaken = bookedSlots.includes(time);
    const isSelected = horaInput.value === time;

    const label = document.createElement("span");
    label.textContent = time;

    const badge = document.createElement("span");
    badge.classList.add("text-xs");

    if (isTaken) {
      slot.classList.add("time-taken");
      badge.textContent = "Ocupado";
      badge.classList.add("text-red-400/60");
    } else if (isSelected) {
      slot.classList.add("time-selected");
      badge.innerHTML = '<i class="fas fa-check"></i>';
    } else {
      badge.textContent = "Disponible";
      badge.classList.add("text-green-400/60");
    }

    slot.appendChild(label);
    slot.appendChild(badge);

    if (!isTaken) {
      slot.addEventListener("click", () => {
        horaInput.value = time;
        horaText.textContent = time + " hs";
        horaText.classList.remove("text-gray-500");
        horaText.classList.add("text-white");
        horaDropdown.classList.add("hidden");
        renderTimeSlots();
      });
    }

    horaSlots.appendChild(slot);
  });
}

// Toggle time dropdown
horaDisplay.addEventListener("click", () => {
  renderTimeSlots();
  horaDropdown.classList.toggle("hidden");
  calendarDropdown.classList.add("hidden");
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("fecha-wrapper").contains(e.target)) {
    calendarDropdown.classList.add("hidden");
  }
  if (!document.getElementById("hora-wrapper").contains(e.target)) {
    horaDropdown.classList.add("hidden");
  }
});

// Initial render
renderCalendar();

// ================================================
// BOOKING FORM → WHATSAPP
// ================================================

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const servicio = document.getElementById("servicio").value;
  const fecha = fechaInput.value;
  const hora = horaInput.value;
  const mensaje = document.getElementById("mensaje").value.trim();

  // Validate
  if (!nombre || !telefono || !servicio || !fecha || !hora) {
    // Highlight missing fields
    if (!fecha) {
      fechaDisplay.style.borderColor = "#ef4444";
      setTimeout(() => { fechaDisplay.style.borderColor = ""; }, 2000);
    }
    if (!hora) {
      horaDisplay.style.borderColor = "#ef4444";
      setTimeout(() => { horaDisplay.style.borderColor = ""; }, 2000);
    }
    return;
  }

  // Format date nicely
  const fechaFormateada = new Date(fecha + "T00:00:00").toLocaleDateString(
    "es-AR",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // Build WhatsApp message
  let text = `🔔 *Nuevo turno - NAIOT Barbería*\n\n`;
  text += `👤 *Nombre:* ${nombre}\n`;
  text += `📱 *Teléfono:* ${telefono}\n`;
  text += `✂️ *Servicio:* ${servicio}\n`;
  text += `📅 *Fecha:* ${fechaFormateada}\n`;
  text += `🕐 *Hora:* ${hora}\n`;

  if (mensaje) {
    text += `💬 *Mensaje:* ${mensaje}\n`;
  }

  text += `\n✅ Enviado desde naiot.com`;

  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  // Save to localStorage
  saveTurno({
    nombre,
    telefono,
    servicio,
    fecha,
    hora,
    mensaje,
    timestamp: Date.now(),
  });

  // Show success message
  successMsg.classList.remove("hidden");

  // Open WhatsApp
  setTimeout(() => {
    window.open(whatsappURL, "_blank");
  }, 500);

  // Reset form after a delay
  setTimeout(() => {
    bookingForm.reset();
    successMsg.classList.add("hidden");

    // Reset custom pickers
    selectedDate = null;
    fechaInput.value = "";
    horaInput.value = "";
    fechaText.textContent = "Elegí una fecha";
    fechaText.classList.remove("text-white");
    fechaText.classList.add("text-gray-500");
    horaText.textContent = "Elegí una hora";
    horaText.classList.remove("text-white");
    horaText.classList.add("text-gray-500");
    renderCalendar();
  }, 4000);
});

// ---- LocalStorage for bookings ----
function saveTurno(turno) {
  const turnos = JSON.parse(localStorage.getItem("naiot_turnos") || "[]");
  turnos.push(turno);
  localStorage.setItem("naiot_turnos", JSON.stringify(turnos));
}

function getTurnos() {
  return JSON.parse(localStorage.getItem("naiot_turnos") || "[]");
}

// ---- Fade-in animations (Intersection Observer) ----
const fadeElements = document.querySelectorAll(".fade-in");

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach((el) => observer.observe(el));

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      const navHeight = navbar.offsetHeight;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});
