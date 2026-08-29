# 🚀 Miacon 2.0 - Plataforma Interactiva de Ingeniería de Control

**Miacon 2.0** es una plataforma web educativa diseñada para el aprendizaje práctico e intuitivo de la teoría de control automático, modelado de sistemas dinámicos y controladores PID.

---

## 🌟 Características Principales

*   **⚡ Estética High-Tech / Glassmorphism**: Interfaz moderna con efectos de cristal, gradientes mesh y diseño responsive.
*   **📊 Osciloscopio Virtual en Vivo**: Visualizador interactivo en la portada con simulación de perturbaciones y modos de respuesta.
*   **📚 Módulos Teóricos en 4 Tarjetas Dinámicas**:
    1. **Fundamentos y Lazo de Control**: Conmutación interactiva entre lazo abierto y lazo cerrado con inyección de perturbaciones.
    2. **Control Proporcional (P)**: Ajuste de ganancia $K_p$ y visualización del error en estado estacionario.
    3. **Control Proporcional Integral (PI)**: Eliminación de error en régimen permanente con la acción integral.
    4. **Control PID Completo**: Sintonización $K_p, K_i, K_d$ con cálculo en tiempo real de **Sobrepaso ($M_p$)**, **Tiempo de Subida ($t_r$)** y **Tiempo de Asentamiento ($t_s$)**.
*   **🛠️ Ruta de Laboratorios & Lab 0**:
    *   Mapa de ruta estilo videojuego para seleccionar prácticas.
    *   **Lab 0: Construcción y Comprobación**: Checklist de conexión física de hardware (puente H, motor DC, encoders) y consola de diagnóstico serial simulada.

---

## 🛠️ Tecnologías Utilizadas

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
*   **Gráficas Dinámicas**: [Recharts](https://recharts.org/)
*   **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 💻 Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Despliegue en Vercel

El proyecto está 100% optimizado y listo para ser desplegado en [Vercel](https://vercel.com/):

### Opción 1: Despliegue Automático mediante GitHub (Recomendado)
1. Sube los cambios a tu repositorio de GitHub:
   ```bash
   git add .
   git commit -m "Preparar Miacon 2.0 para despliegue en Vercel"
   git push origin main
   ```
2. Ve a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New..."** > **"Project"**.
4. Selecciona el repositorio **`Web_Miacon2`**.
5. Vercel detectará automáticamente que es un proyecto **Next.js**. Haz clic en **"Deploy"**.

### Opción 2: Despliegue desde la Terminal con Vercel CLI
1. Instala la herramienta de Vercel (si no la tienes):
   ```bash
   npm i -g vercel
   ```
2. Ejecuta el comando de despliegue dentro del directorio del proyecto:
   ```bash
   vercel
   ```
3. Sigue las instrucciones interactivas en la terminal.

---

## 📄 Licencia

Miacon 2026 — Proyecto Educativo de Ingeniería y Control Automático.
