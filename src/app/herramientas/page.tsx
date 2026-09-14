"use client";

import { useState } from "react";
import {
  Calculator,
  Layers,
  Cpu,
  Radio,
  GitBranch,
  Plug,
  Download,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Terminal,
  Wrench,
  X,
} from "lucide-react";

interface SoftwareTool {
  id: string;
  name: string;
  version: string;
  category: string;
  icon: any;
  shortDesc: string;
  badge: string;
  badgeType: "license" | "free" | "cloud" | "advanced";
  requirements: string[];
  steps: {
    title: string;
    description: string;
    code?: string;
  }[];
  primaryAction: {
    label: string;
    url: string;
    isExternal: boolean;
  };
  docUrl?: string;
}

const TOOLS_DATA: SoftwareTool[] = [
  {
    id: "matlab",
    name: "MATLAB",
    version: "R2025b / R2024b",
    category: "Cálculo Numérico & Modelado",
    icon: Calculator,
    shortDesc: "Entorno estándar en ingeniería para análisis matemático, matrices y validación de funciones de transferencia.",
    badge: "Requiere Licencia Institucional",
    badgeType: "license",
    requirements: [
      "Windows 10/11 (64-bit)",
      "8 GB RAM mínimo (16 GB recomendado)",
      "30 GB de espacio libre en disco SSD",
      "Cuenta de correo institucional UIS"
    ],
    steps: [
      {
        title: "Paso 1: Accede a mathworks",
        description: "Dale a obetener de MATLAB a través de su universidad, accede a mathworks.com/downloads e inicia sesión o registrate utilizando tu correo institucional (@uis.edu.co o @correo.uis.edu.co)."
      },
      {
        title: "Paso 2: Descargar el MATLAB Installer",
        description: "Accede a mathworks.com/downloads e inicia sesión. Descarga el instalador oficial para Windows."
      },
      {
        title: "Paso 3: Selección de Toolboxes Clave",
        description: "Durante el asistente de instalación, asegúrate de marcar los siguientes paquetes esenciales: Control System Toolbox, Signal Processing Toolbox, Optimization Toolbox y Simulink."
      },
      {
        title: "Paso 4: Activación y Verificación",
        description: "Inicia sesión en la aplicación instalada con tus credenciales UIS. En la consola ejecuta `ver` para comprobar los toolboxes instalados.",
        code: "ver % Muestra la versión y toolboxes instalados en tu equipo"
      }
    ],
    primaryAction: {
      label: "Descargar en MathWorks",
      url: "https://la.mathworks.com/products/matlab/student.html",
      isExternal: true
    },
    docUrl: "https://la.mathworks.com/help/matlab/"
  },
  {
    id: "simulink",
    name: "Simulink",
    version: "Integrado en MATLAB",
    category: "Simulación de Sistemas Dinámicos",
    icon: Layers,
    shortDesc: "Plataforma gráfica de diagramas de bloques para simulación multidominio y diseño basado en modelos para sistemas de control.",
    badge: "Incluido con MATLAB",
    badgeType: "license",
    requirements: [
      "Instalación base de MATLAB activa",
      "Control System Toolbox habilitado",
      "Tarjeta gráfica compatible con OpenGL"
    ],
    steps: [
      {
        title: "Paso 1: Verificar Instalación",
        description: "Si instalaste MATLAB siguiendo el asistente, Simulink ya estará disponible. Puedes abrirlo desde la pestaña 'Home' de MATLAB o desde la línea de comandos.",
        code: "simulink % Abre la biblioteca de bloques de Simulink"
      },
      {
        title: "Paso 2: Instalar Paquetes de Soporte de Hardware",
        description: "Ve a Add-Ons > Get Hardware Support Packages e instala 'MATLAB Support Package for Arduino Hardware' si deseas prototipar en tiempo real."
      },
      {
        title: "Paso 3: Probar Modelo de Primer Orden",
        description: "Crea un nuevo modelo en blanco, agrega un bloque 'Step', una función de transferencia 'Transfer Fcn' y un 'Scope' para comprobar la respuesta temporal."
      }
    ],
    primaryAction: {
      label: "Documentación Simulink",
      url: "https://la.mathworks.com/products/simulink.html",
      isExternal: true
    },
    docUrl: "https://la.mathworks.com/help/simulink/"
  },
  {
    id: "arduino",
    name: "Arduino IDE",
    version: "v2.3+",
    category: "Entorno de Programación de Microcontroladores",
    icon: Cpu,
    shortDesc: "Software de código abierto para compilar y cargar el firmware de control PID, adquisición analógica y telemetría en el módulo Miacon.",
    badge: "Descarga Gratuita",
    badgeType: "free",
    requirements: [
      "Windows 10/11 (64-bit)",
      "Puerto USB tipo A o C disponible",
      "Permisos de administrador para instalación de drivers"
    ],
    steps: [
      {
        title: "Paso 1: Descargar Arduino IDE 2.x",
        description: "Descarga el instalador oficial para Windows desde el sitio web oficial de Arduino."
      },
      {
        title: "Paso 2: Configurar URL de Tarjetas Adicionales",
        description: "Abre Preferencias (Ctrl + Coma) y en 'Gestor de URLs Adicionales de Tarjetas' añade el repositorio oficial según el microcontrolador de tu módulo Miacon."
      },
      {
        title: "Paso 3: Instalar el Gestor de Placas",
        description: "Abre el menú lateral de Tarjetas (Board Manager), busca e instala el paquete correspondiente (ej. ESP32 by Espressif o Arduino AVR Boards)."
      },
      {
        title: "Paso 4: Instalar Librerías de Control & MQTT",
        description: "En el Gestor de Librerías (Library Manager), instala 'PubSubClient' de Nick O'Leary y 'ArduinoJson' para el manejo de tramas de telemetría."
      }
    ],
    primaryAction: {
      label: "Descargar Arduino IDE",
      url: "https://www.arduino.cc/en/software",
      isExternal: true
    },
    docUrl: "https://docs.arduino.cc/"
  },
  {
    id: "drivers",
    name: "Drivers USB-Serial",
    version: "CH340 / CP2102",
    category: "Conectividad Hardware & Enlace COM",
    icon: Plug,
    shortDesc: "Controladores indispensables para que tu sistema operativo reconozca el puerto serie USB del microcontrolador Miacon.",
    badge: "Descarga Gratuita",
    badgeType: "free",
    requirements: [
      "Cables de datos micro-USB o USB-C certificados (no solo de carga)",
      "Reconocimiento de puerto en Administrador de Dispositivos"
    ],
    steps: [
      {
        title: "Paso 1: Identificar el Chip de Conversión",
        description: "Revisa el circuito integrado cercano al conector USB del Miacon. Comúnmente corresponde al integrado CH340C/G o Silicon Labs CP2102."
      },
      {
        title: "Paso 2: Descargar e Instalar el Controlador",
        description: "Para CH340 descarga el ejecutable CH341SER.EXE desde el fabricante WCH. Para CP210x descarga el instalador oficial de Silicon Labs."
      },
      {
        title: "Paso 3: Verificar en el Administrador de Dispositivos",
        description: "Conecta el módulo Miacon. Abre 'Administrador de Dispositivos > Puertos (COM y LPT)' y comprueba que aparezca asignado (ej. COM3, COM4) sin símbolos de advertencia amarillo."
      }
    ],
    primaryAction: {
      label: "Descargar Driver CH340",
      url: "http://www.wch-ic.com/downloads/CH341SER_EXE.html",
      isExternal: true
    },
    docUrl: "https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers"
  },
  {
    id: "mqtt",
    name: "MQTT Broker (HiveMQ)",
    version: "Cloud Serverless",
    category: "Telemetría IIoT & Red de Tiempo Real",
    icon: Radio,
    shortDesc: "Servicio de mensajería ligera pub/sub para enviar y recibir variables de proceso, consignas remotas y participar en competencias docentes.",
    badge: "Cloud Gratuito",
    badgeType: "cloud",
    requirements: [
      "Conexión a Internet activa (WiFi 2.4 GHz para el microcontrolador)",
      "Navegador web moderno para el cliente de prueba"
    ],
    steps: [
      {
        title: "Paso 1: Crear Cuenta en HiveMQ Cloud",
        description: "Regístrate en console.hivemq.cloud de forma gratuita para desplegar un cluster broker gestionado en la nube."
      },
      {
        title: "Paso 2: Obtener Credenciales de Conexión",
        description: "Crea credenciales de acceso (Usuario y Contraseña) y copia la dirección del host (ej. `xxxxxx.hivemq.cloud`) y el puerto TLS seguro (8883) o WebSockets (8884)."
      },
      {
        title: "Paso 3: Probar con el Web Client",
        description: "Utiliza la herramienta integrada 'Web Client' de HiveMQ para suscribirte al tópico `miacon/+/telemetria` y verificar la llegada de tramas JSON en vivo."
      }
    ],
    primaryAction: {
      label: "Crear Broker en HiveMQ",
      url: "https://www.hivemq.com/mqtt-cloud-broker/",
      isExternal: true
    },
    docUrl: "https://www.hivemq.com/docs/"
  }
];

export default function Herramientas() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const selectedTool = TOOLS_DATA.find(t => t.id === selectedToolId);

  const getBadgeStyle = (type: SoftwareTool["badgeType"]) => {
    switch (type) {
      case "license":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "free":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cloud":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "advanced":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-32 pb-16 space-y-12">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Herramientas & <span className="text-blue-700">Setup Hub</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Prepara tu entorno de trabajo antes de ingresar a los laboratorios prácticos.
          Aquí encontrarás instaladores, paquetes de simulación y licencias institucionales requeridas para operar el módulo <strong className="text-blue-800">MIACON 2.0</strong>.
        </p>
      </div>

      {/* 2. APP STORE SOFTWARE GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Ecosistema de Software</h2>
            <p className="text-xs text-slate-500 font-medium">Haz clic en cada tarjeta para desplegar los pasos guiados de instalación</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
            5 Herramientas Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_DATA.map((tool) => {
            const ToolIcon = tool.icon;

            return (
              <div
                key={tool.id}
                className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-blue-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedToolId(tool.id)}
              >
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                      <ToolIcon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getBadgeStyle(tool.badgeType)}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">{tool.name}</h3>
                      <span className="text-xs font-mono font-bold text-slate-400">{tool.version}</span>
                    </div>
                    <p className="text-xs font-semibold text-blue-700">{tool.category}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-3">{tool.shortDesc}</p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700">Ver Configuración</span>
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL OVERLAY */}
      {selectedTool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedToolId(null)}
          ></div>

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white shadow-md shadow-blue-200 flex items-center justify-center shrink-0">
                  {(() => {
                    const ModalIcon = selectedTool.icon;
                    return <ModalIcon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedTool.name}</h3>
                  <p className="text-xs font-semibold text-blue-700">{selectedTool.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedToolId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
              {/* Requirements */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Requisitos de Sistema:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                  {selectedTool.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pasos de Configuración:
                </h4>

                <div className="space-y-3">
                  {selectedTool.steps.map((step, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/70 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono-tech">
                          {idx + 1}
                        </span>
                        <div className="space-y-1 w-full">
                          <p className="text-xs font-bold text-slate-900">{step.title}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

                          {step.code && (
                            <div className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono-tech flex items-center justify-between overflow-x-auto border border-slate-800">
                              <code>{step.code}</code>
                              <Terminal className="w-3.5 h-3.5 text-blue-400 ml-2 shrink-0" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-3">
              <a
                href={selectedTool.primaryAction.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{selectedTool.primaryAction.label}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {selectedTool.docUrl && (
                <a
                  href={selectedTool.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Documentación</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
