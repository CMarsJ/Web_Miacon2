import type { GuideImage, LabGuideData } from "./types";

const img = (
  file: string,
  alt: string,
  width: number,
  height: number,
  caption?: string
): GuideImage => ({ src: `/images/lab1/${file}`, alt, width, height, caption });

/**
 * Práctica 1 — Conexión de una ESP32 con MATLAB y Simulink.
 * Fundamentos de conexión y validación de hardware mediante Simulink y LED.
 */
export const fundamentosPractica1: LabGuideData = {
  slug: "practica-1",
  badge: "Fundamentos • Práctica 1",
  title: "Conexión de una ESP32 con MATLAB y Simulink",
  subtitle: "Preparación del entorno, enlace de hardware y validación de comunicación",
  backHref: "/laboratorios",
  backLabel: "Volver a la Ruta de Laboratorios",
  trackKey: "fundamentos",
  labId: 1,
  stages: [
    {
      id: "preparacion",
      title: "Preparación",
      summary: "Contexto, objetivos de aprendizaje, materiales y advertencias.",
      blocks: [
        {
          type: "text",
          title: "Introducción",
          paragraphs: [
            "En esta práctica se realizará la configuración inicial de una tarjeta ESP32 para trabajar con MATLAB y Simulink. La guía está pensada para estudiantes y usuarios que pueden no tener experiencia previa con estas herramientas, por lo que cada procedimiento indica qué opción seleccionar, dónde encontrarla y qué resultado se espera obtener.",
            "Esta práctica constituye la base indispensable de conexión e interactividad con el microcontrolador, requisito previo para avanzar a los laboratorios de control de temperatura y control electromecánico.",
          ],
        },
        {
          type: "list",
          title: "Objetivos de Aprendizaje",
          items: [
            "Identificar la tarjeta ESP32-WROOM y su interfaz de comunicación serial USB.",
            "Conectar la tarjeta correctamente al computador mediante cable de datos.",
            "Instalar y configurar el paquete de soporte 'Simulink Support Package for Arduino Hardware' en MATLAB.",
            "Identificar el puerto de comunicación COM asignado por el sistema operativo Windows.",
            "Configurar la tarjeta como hardware objetivo (Target Hardware) en Simulink.",
            "Construir un modelo de prueba en Simulink y validar físicamente la comunicación mediante el control ON/OFF de un LED.",
          ],
        },
        {
          type: "materials",
          groups: [
            {
              title: "Hardware Requerido",
              items: [
                "Tarjeta de desarrollo ESP32-WROOM compatible.",
                "Cable USB de datos (micro-USB o tipo C según la tarjeta).",
                "Protoboard (placa de pruebas).",
                "1 Diodo LED (cualquier color para la validación).",
                "1 Resistencia de protección (220 Ω o 330 Ω).",
                "Cables de conexión (jumper macho-macho o macho-hembra según montaje).",
                "Computador con puertos USB disponibles.",
              ],
            },
            {
              title: "Software Requerido",
              items: [
                "MATLAB (R2022b o superior recomendado).",
                "Simulink.",
                "Simulink Support Package for Arduino Hardware (con soporte para ESP32).",
                "Controladores USB-UART (Silicon Labs CP210x o WCH CH340).",
              ],
            },
          ],
        },
        {
          type: "warning",
          tone: "note",
          text: "El número del puerto COM puede ser diferente en cada computador. COM7 se muestra en las figuras solo como ejemplo basado en la prueba realizada.",
        },
        {
          type: "warning",
          tone: "important",
          text: "Un cable USB que solamente sea de carga eléctrica no permitirá transmitir datos ni establecer la comunicación entre MATLAB y la ESP32. Asegúrese de utilizar un cable USB de datos.",
        },
      ],
    },
    {
      id: "montaje",
      title: "Montaje y configuración",
      summary: "Instalación del paquete de soporte, conexión USB y reconocimiento en MATLAB.",
      blocks: [
        {
          type: "steps",
          title: "1. Preparación del entorno en MATLAB",
          steps: [
            {
              title: "Abrir MATLAB",
              instruction:
                "Inicie MATLAB desde el computador. Una vez abierto, se mostrará la ventana principal del programa.",
              images: [
                img(
                  "fig01_matlab_home.png",
                  "Ventana principal de MATLAB",
                  1227,
                  566,
                  "Figura 1. Referencia visual para ubicar las herramientas de MATLAB."
                ),
              ],
              expected: "Debe visualizarse la ventana principal de MATLAB con la barra de herramientas Home.",
            },
            {
              title: "Abrir el administrador de Add-Ons",
              instruction:
                "Desde la pestaña Home, ubique la sección Environment y seleccione Add-Ons. En el menú desplegable, seleccione Explore Add-Ons.",
              path: "Home > Environment > Add-Ons > Explore Add-Ons",
              images: [
                img(
                  "fig02_addons_menu.png",
                  "Menú Add-Ons de MATLAB",
                  1227,
                  566,
                  "Figura 2. Menú Add-Ons de MATLAB."
                ),
                img(
                  "fig03_explore_addons.png",
                  "Opción Explore Add-Ons",
                  1716,
                  630,
                  "Figura 3. Menú Add-Ons de MATLAB: opción Explore Add-Ons."
                ),
              ],
            },
            {
              title: "Buscar el paquete de soporte",
              instruction:
                "Se abrirá Add-On Explorer. En el buscador escriba ESP32 o busque directamente 'Simulink Support Package for Arduino Hardware'.",
              images: [
                img(
                  "fig04_addon_explorer.png",
                  "Add-On Explorer con el paquete de soporte para Arduino",
                  1443,
                  807,
                  "Figura 4. Add-On Explorer mostrando el paquete de soporte para Arduino."
                ),
              ],
            },
            {
              title: "Abrir Hardware Setup",
              instruction:
                "En la página del paquete 'Simulink Support Package for Arduino Hardware', seleccione Manage y espere a que MATLAB abra el asistente Hardware Setup.",
              actions: [
                "En la página del paquete Simulink Support Package for Arduino Hardware, seleccione Manage.",
                "Espere a que MATLAB abra el asistente Hardware Setup.",
              ],
              images: [
                img(
                  "fig05_hardware_support.png",
                  "Página de soporte de hardware con el botón Manage",
                  1438,
                  670,
                  "Figura 5. Soporte de Hardware."
                ),
                img(
                  "fig06_support_package.png",
                  "Menú del Simulink Support Package for Arduino Hardware",
                  715,
                  517,
                  "Figura 6. Menú Simulink Support Package for Arduino Hardware."
                ),
              ],
              expected:
                "Se abre la ventana Hardware Setup, desde la cual se puede seleccionar el hardware y continuar con la instalación de los componentes.",
            },
            {
              title: "Descargar las librerías y drivers para ESP32",
              instruction:
                "En Arduino Compatible Hardware, marque la casilla ESP32. No seleccione otras plataformas si no serán utilizadas en la práctica. Presione Next > para continuar.",
              actions: [
                "En Arduino Compatible Hardware, marque ESP32.",
                "No seleccione otras plataformas si no serán utilizadas en la práctica.",
                "Presione Next > para continuar y complete las pantallas del asistente.",
              ],
              images: [
                img(
                  "hs_select_hardware.png",
                  "Hardware Setup: Select Hardware con ESP32 marcado",
                  970,
                  726,
                  "Hardware Setup: Select Hardware (ESP32 marcado en Arduino Compatible Hardware)."
                ),
                img(
                  "hs_third_party_1.png",
                  "Hardware Setup: Install Third-Party Software, paso 1 de 2",
                  722,
                  541,
                  "Hardware Setup: Install Third-Party Software (Step 1 of 2)."
                ),
                img(
                  "hs_third_party_2.png",
                  "Hardware Setup: Install Third-Party Software, paso 2 de 2",
                  721,
                  537,
                  "Hardware Setup: Install Third-Party Software (Step 2 of 2)."
                ),
                img(
                  "hs_connect_board.png",
                  "Hardware Setup: Connect an Arduino Board",
                  727,
                  541,
                  "Hardware Setup: Connect an Arduino Board."
                ),
              ],
              expected:
                "En Arduino Compatible Hardware queda seleccionada la opción ESP32. La instalación de las librerías y drivers finaliza y Hardware Setup permite continuar.",
              note: "Durante esta etapa el instalador descarga librerías como ESP32 Core. Espere a que termine cada descarga antes de continuar.",
            },
          ],
        },
        {
          type: "steps",
          title: "2. Conexión física y verificación en Windows",
          steps: [
            {
              title: "Conectar la ESP32 al computador",
              instruction: "Conecte la tarjeta ESP32 mediante el cable USB de datos.",
              actions: [
                "Conecte el extremo micro-USB / tipo C a la tarjeta ESP32.",
                "Conecte el extremo USB al computador.",
                "Espere unos segundos a que Windows reconozca el dispositivo.",
              ],
              warning: "Asegúrese de que el LED de encendido (PWR) de la ESP32 permanezca encendido.",
            },
            {
              title: "Verificar el puerto en el Administrador de dispositivos",
              instruction:
                "Abra el Administrador de dispositivos de Windows y despliegue la categoría 'Puertos (COM y LPT)'. La ESP32 aparecerá asociada a un convertidor USB-UART (por ejemplo Silicon Labs CP210x o CH340).",
              path: "Administrador de dispositivos > Puertos (COM y LPT)",
              images: [
                img(
                  "fig07_device_manager.png",
                  "Administrador de dispositivos con la ESP32 en un puerto COM",
                  555,
                  330,
                  "Figura 7. ESP32 reconocida por Windows (ejemplo: COM7)."
                ),
              ],
              verify: "Anote el número del puerto COM asignado (ej. COM3, COM7, etc.); lo utilizará a continuación.",
            },
            {
              title: "Seleccionar ESP32 Wroom y el puerto COM en MATLAB",
              instruction:
                "En el asistente Hardware Setup, actualice la lista de puertos y seleccione la tarjeta y el puerto asignado.",
              actions: [
                "En la sección Select a Board, haga clic en Refresh para actualizar la lista de puertos disponibles.",
                "En Supported boards, seleccione 'ESP32 Wroom'.",
                "En Port, elija el puerto COM verificado en Windows.",
                "Presione Next > para confirmar.",
              ],
              images: [
                img(
                  "fig08_select_board.png",
                  "Hardware Setup: Select a Board con ESP32 Wroom y puerto COM",
                  958,
                  722,
                  "Figura 8. Selección de tarjeta y puerto COM en MATLAB."
                ),
              ],
              expected:
                "La tarjeta ESP32 Wroom y el puerto de comunicación quedan seleccionados y el asistente finaliza con éxito.",
            },
          ],
        },
      ],
    },
    {
      id: "validacion",
      title: "Validación",
      summary: "Configuración en Simulink, bloques de prueba y comprobación física con LED.",
      blocks: [
        {
          type: "text",
          title: "Validación del enlace Simulink - ESP32",
          paragraphs: [
            "Para verificar que el paquete de soporte está correctamente vinculado con la tarjeta, construiremos un modelo simple en Simulink que genere un tren de pulsos y controle el encendido y apagado de un LED físico conectado a un pin de la ESP32.",
          ],
        },
        {
          type: "steps",
          title: "Procedimiento de Validación",
          steps: [
            {
              title: "Configurar el Hardware Objetivo en Simulink",
              instruction:
                "Abra Simulink y cree un nuevo modelo en blanco (Blank Model). Abra los Parámetros de Configuración del modelo (Hardware Settings / Model Configuration Parameters).",
              path: "Simulink > Modeling > Model Settings (o presione Ctrl + E)",
              actions: [
                "En el panel izquierdo seleccione 'Hardware Implementation'.",
                "En 'Hardware board', seleccione 'ESP32-WROOM'.",
                "Despliegue 'Target hardware resources' y seleccione 'Host-board connection'.",
                "Asegúrese de configurar 'Set host COM port' en 'Manually' y coloque el puerto COM de su tarjeta (o 'Automatically').",
                "Presione 'Apply' y luego 'OK'.",
              ],
              images: [
                img(
                  "simulink_config.png",
                  "Configuración del Hardware ESP32-WROOM en Simulink",
                  791,
                  551,
                  "Configuración de Hardware Implementation: Selección de ESP32-WROOM y puerto COM."
                ),
              ],
              expected: "Simulink queda configurado para compilar y comunicarse con la arquitectura ESP32-WROOM.",
            },
            {
              title: "Armar los bloques de prueba en Simulink",
              instruction:
                "Desde la librería de Simulink y la librería del soporte de Arduino, agregue un generador de pulsos, un visor y una salida digital.",
              actions: [
                "Agregue el bloque 'Pulse Generator' (Simulink / Sources).",
                "Agregue el bloque 'Scope' (Simulink / Sinks).",
                "Agregue el bloque 'Digital Output' (Simulink Support Package for Arduino / Common).",
                "Configure los parámetros del Pulse Generator: Period = 1000, Pulse width = 500, Sample time = 0.001.",
                "Haga doble clic en el bloque Digital Output y asigne el Pin = 26.",
                "Conecte la salida del Pulse Generator tanto a la entrada del Scope como al bloque Digital Output.",
              ],
              images: [
                img(
                  "simulink_blocks.png",
                  "Diagrama de bloques de Simulink para comprobación con LED",
                  785,
                  337,
                  "Diagrama en Simulink: Pulse Generator conectado a Scope y a Digital Output (Pin 26)."
                ),
              ],
              expected: "El diagrama queda conectado y listo para compilar y ejecutar.",
            },
            {
              title: "Conexión física del LED en protoboard",
              instruction:
                "Realice la conexión del circuito indicador en la protoboard con la tarjeta desenergizada o conectada:",
              actions: [
                "Conecte el ánodo (pata larga) del LED a una terminal de la resistencia de protección (220 Ω / 330 Ω).",
                "Conecte el otro extremo de la resistencia al Pin GPIO 26 de la ESP32.",
                "Conecte el cátodo (pata corta o lado plano) del LED a uno de los pines GND (tierra) de la ESP32.",
              ],
              images: [
                img(
                  "esp32_led.png",
                  "Conexión del circuito con LED al Pin 26 de la ESP32",
                  356,
                  376,
                  "Esquema de conexión en protoboard: LED con resistencia conectado al Pin 26 y GND de la ESP32."
                ),
              ],
              warning: "No conecte el LED directamente entre el pin 26 y GND sin resistencia, ya que puede dañar el LED o el puerto del microcontrolador.",
            },
            {
              title: "Ejecución y comprobación del parpadeo",
              instruction:
                "En la pestaña 'Hardware' de Simulink, ejecute el modelo para verificar el funcionamiento:",
              actions: [
                "Vaya a la pestaña 'Hardware' en la barra superior de Simulink.",
                "Haga clic en 'Monitor & Tune' (o 'Run' según el modo configurado).",
                "Simulink compilará el código y establecerá el canal de comunicación con la ESP32.",
              ],
              expected:
                "El LED físico en la protoboard comenzará a parpadear periódicamente al ritmo del tren de pulsos configurado, confirmando la comunicación bidireccional exitosa entre Simulink y la ESP32.",
              verify:
                "Abra el bloque Scope haciendo doble clic para confirmar que la señal cuadrada generada coincide en frecuencia con los destellos del LED físico.",
            },
          ],
        },
      ],
    },
    {
      id: "fallos",
      title: "Problemas y fallos clásicos",
      summary: "Diagnóstico y soluciones a los errores más comunes durante la práctica.",
      blocks: [
        {
          type: "troubleshooting",
          title: "Diagnóstico de fallos frecuentes en el laboratorio",
          items: [
            {
              problem: "La ESP32 no aparece en el Administrador de dispositivos de Windows ni en MATLAB.",
              cause:
                "Cable USB defectuoso o únicamente de carga (sin líneas de datos D+ / D-), o falta de controlador del chip convertidor UART.",
              solution:
                "Pruebe con otro cable USB de datos comprobado con un teléfono u otro microcontrolador. Si el Administrador muestra un dispositivo con triángulo amarillo, instale el driver de Silicon Labs CP210x o WCH CH340 según el chip de su placa.",
            },
            {
              problem: "Error en MATLAB/Simulink: 'Port Busy', 'Access is denied' o el puerto COM no abre.",
              cause:
                "El puerto COM está siendo utilizado por otro software en segundo plano (por ejemplo el monitor serie de Arduino IDE, PuTTY, CURA, o una sesión previa no cerrada).",
              solution:
                "Cierre Arduino IDE, terminales seriales y cualquier otro software que monitoree puertos COM. En MATLAB ejecute el comando 'clear all' o desconecte y vuelva a conectar el cable USB.",
            },
            {
              problem: "Simulink no muestra 'ESP32-WROOM' en la lista de Hardware Implementation.",
              cause:
                "El paquete de soporte para Arduino se instaló pero no se completó la descarga del módulo específico para ESP32.",
              solution:
                "Vuelva a MATLAB > Home > Add-Ons > Manage. En el paquete de Arduino seleccione la rueda de engranaje o 'Hardware Setup', marque explícitamente la casilla 'ESP32' y complete todos los pasos del instalador de terceros.",
            },
            {
              problem: "El modelo compila pero el LED no enciende ni parpadea en la protoboard.",
              cause:
                "Polaridad invertida del LED, mal contacto en la protoboard, o asignación incorrecta del número de pin en Simulink.",
              solution:
                "Verifique que la pata larga del LED (ánodo) esté conectada a la resistencia que va al Pin 26, y la pata corta (cátodo) a GND. Revise en el bloque Digital Output de Simulink que el valor numérico del pin sea exactamente '26'.",
            },
            {
              problem: "Fallo durante la carga: 'A fatal error occurred: Failed to connect to ESP32: Timed out waiting for packet header'.",
              cause:
                "Algunas placas ESP32 requieren entrar manualmente en modo bootloader para recibir la programación.",
              solution:
                "Mantenga presionado el botón 'BOOT' de la placa ESP32 en el momento en que Simulink muestre 'Connecting...' en la consola, y suéltelo en cuanto inicie la barra de porcentaje de subida.",
            },
          ],
        },
        {
          type: "warning",
          tone: "note",
          text: "Si experimenta algún comportamiento diferente no contemplado aquí, consulte con el docente o anote el código de error mostrado en la ventana de diagnóstico de MATLAB.",
        },
      ],
    },
    {
      id: "reto",
      title: "Reto: semáforo ON/OFF",
      summary: "Aplicación autónoma: lógica secuencial para un semáforo de 3 estados.",
      isChallenge: true,
      blocks: [
        {
          type: "challenge",
          title: "Control ON/OFF de un Semáforo Secuencial",
          objective:
            "Diseñar e implementar en Simulink la lógica de control ON/OFF para coordinar la secuencia de luces de un semáforo real de 3 estados (Verde, Amarillo y Rojo) conectado físicamente a la ESP32.",
          problem:
            "Utilizando los conocimientos adquiridos en la validación del LED, el estudiante debe expandir el circuito y el modelo de Simulink para controlar de forma sincronizada 3 LEDs independientes que simulen la secuencia de tráfico vehicular estándar.",
          requirements: [
            "Conectar 3 LEDs (Verde, Amarillo y Rojo) con sus respectivas resistencias de protección en 3 pines digitales diferentes de la ESP32 (por ejemplo pines 25, 26 y 27).",
            "Construir en Simulink la lógica de temporización para que los tres colores se alternen secuencialmente sin solaparse indebidamente.",
            "Validar en el hardware real que la secuencia se ejecuta de manera continua y visible en la protoboard.",
          ],
          constraints: [
            "Los tres colores deben compartir la misma referencia de tierra (GND).",
            "Tiempos sugeridos de la secuencia: Verde activo durante 5 segundos, Amarillo activo durante 2 segundos, y Rojo activo durante 5 segundos.",
            "Cada LED debe contar con su propia resistencia de protección individual.",
          ],
          deliverables: [
            "Archivo del modelo de Simulink (.slx) funcional y documentado.",
            "Esquema de conexiones y tabla de asignación de pines GPIO utilizados.",
            "Demostración física del funcionamiento al docente.",
          ],
          hints: [
            "Puede emplear múltiples bloques 'Pulse Generator' desfasando su parámetro 'Phase delay' en función del periodo total.",
            "También puede explorar el bloque 'Stateflow Chart' para modelar la máquina de estados finitos del semáforo con transiciones temporales (after(5, sec)).",
            "Otra alternativa es el uso de bloques lógicos combinatorios (AND, OR, NOT) con contadores o relojes (Digital Clock).",
          ],
          solution: {
            title: "Guía de referencia para la solución del Semáforo",
            description:
              "Existen dos métodos principales recomendados para resolver este reto en Simulink:\n\n1. Método por Pulsos Desfasados (Pulse Generators):\nSe calcula un período total T = 5s (Verde) + 2s (Amarillo) + 5s (Rojo) = 12 segundos.\n- Pulse Generator Verde: Period = 12, Pulse Width = 5s (41.67%), Phase delay = 0.\n- Pulse Generator Amarillo: Period = 12, Pulse Width = 2s (16.67%), Phase delay = 5s.\n- Pulse Generator Rojo: Period = 12, Pulse Width = 5s (41.67%), Phase delay = 7s.\n\n2. Método por Carta Stateflow:\nSe definen tres estados: ESTADO_VERDE, ESTADO_AMARILLO y ESTADO_ROJO, con transiciones:\n- ESTADO_VERDE: salida Verde=1, Amarillo=0, Rojo=0. Transición: after(5, sec) -> ESTADO_AMARILLO.\n- ESTADO_AMARILLO: salida Verde=0, Amarillo=1, Rojo=0. Transición: after(2, sec) -> ESTADO_ROJO.\n- ESTADO_ROJO: salida Verde=0, Amarillo=0, Rojo=1. Transición: after(5, sec) -> ESTADO_VERDE.",
            notes: [
              "El docente evaluará la creatividad, optimización de bloques y correcto funcionamiento en hardware.",
              "Asegúrese de guardar su modelo con el nombre asignado por el docente antes de finalizar.",
            ],
          },
        },
      ],
    },
  ],
};
