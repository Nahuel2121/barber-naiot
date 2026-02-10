# ✂️ NAIOT Barbería

Landing page para **Naiot Barbería**, una barbería premium ubicada en Buenos Aires, Argentina. Permite a los clientes ver los servicios, explorar la galería de trabajos y reservar turnos directamente por WhatsApp.

## 🚀 Tecnologías

- **HTML5** — Estructura semántica
- **Tailwind CSS v4** (CDN) — Estilos y diseño responsive
- **JavaScript vanilla** — Lógica, calendario, formulario de reservas
- **Font Awesome** — Íconos
- **Google Fonts** (Outfit) — Tipografía

## 📋 Funcionalidades

### 🏠 Landing Page
- Diseño dark premium con acentos dorados
- Navbar responsive con menú hamburguesa en mobile
- Animaciones de entrada (fade-in) con Intersection Observer
- Scroll suave entre secciones

### 🖼️ Galería
- Grid responsive de trabajos realizados
- Efecto hover con overlay y nombre del corte

### 💈 Servicios
- Servicios individuales: Corte, Barba, Afeitado, Cejas, Diseños
- Combos: Corte + Barba, Completo (Corte+Barba+Cejas+Diseño)
- Sección "Próximamente" para nuevos servicios

### 📅 Sistema de Reservas
- **Calendario personalizado** con navegación por meses
  - Domingos deshabilitados (cerrado)
  - Días pasados no seleccionables
  - Indicador visual del día actual
- **Selector de horarios** en intervalos de 30 minutos
  - Lunes a Viernes: 9:00 – 20:00
  - Sábados: 9:00 – 18:00
  - Horarios ya reservados marcados como "Ocupado"
- **Envío por WhatsApp** con mensaje pre-armado
- **Persistencia en localStorage** para trackear turnos reservados

### 📱 Contacto
- Botón flotante de WhatsApp
- Links a redes sociales
- Horarios de atención
- Datos de contacto

## 📁 Estructura

```
├── index.html      # Página principal
├── styles.css      # Estilos personalizados
├── main.js         # Lógica del calendario, formulario y animaciones
├── .gitignore      # Archivos ignorados por Git
└── README.md       # Este archivo
```

## 🛠️ Uso

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/Nahuel2121/naiot-barber.git
   ```
2. Abrí `index.html` en tu navegador (no requiere servidor ni instalación).

## 📝 Licencia

© 2026 NAIOT Barbería. Todos los derechos reservados.
