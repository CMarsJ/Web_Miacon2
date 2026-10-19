import re

file_path = r"c:\Users\carje\Documents\GitHub\Web_Miacon2\src\app\laboratorios\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'\{\s*id:\s*1,\s*title:\s*"Modelado y Simulación en MATLAB".*?tags: \[.*?\]\s*\},'

replacement = """{
          id: 1,
          title: "Configuración inicial y verificación",
          subtitle: "MATLAB • Simulink • ESP32",
          description:
            "Configuración inicial de una tarjeta ESP32 para trabajar con MATLAB y Simulink. Instalación de paquetes de soporte y comprobación de puerto COM.",
          status: "available",
          time: "60 min",
          difficulty: "Básico",
          path: "/laboratorios/lab1",
          badge: "Práctica 1",
          tags: ["💻 MATLAB", "📊 Simulink", "🔌 ESP32"]
        },"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated")
