<template>
  <v-card class="pantalla">
    <v-toolbar color="black" dark flat>
      <v-toolbar-title class="titulo"
        >Dictador de voz</v-toolbar-title
      >
    </v-toolbar>

    <v-tabs v-model="tab" background-color="transparent" color="white">
      <v-tab class="tab-item">Dictado Pausado</v-tab>
      <v-tab class="tab-item">Dictado Corrido</v-tab>
      <v-tab class="tab-item">Dictado propio</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container class="container">
          <div class="velocity">
            <h4 class="velocidad-texto">Velocidad de dictado:</h4>
            <div class="sliderlol">
              <v-slider
                class="controladorV"
                v-model="media"
                thumb-label
                color="grey"
              ></v-slider>
            </div>
            <span class="porcentaje">{{ media }}%</span>
          </div>
          <div class="dictate-container">
            <v-btn
              outlined
              class="boton playBoton"
              @click="nuevoDictado('escolar')"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              outlined
              class="boton pauseBoton"
              @click="pausarDictado"
            >
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn
              outlined
              class="boton stopBoton"
              @click="detenerDictado"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </div>
          <v-textarea
            name="input-7-1"
            filled
            label="Escribe tu texto aquí"
            auto-grow
            class="text-area"
            v-model="textoDictado"
          ></v-textarea>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container class="container">
          <div class="velocity">
            <h4 class="velocidad-texto">Velocidad de dictado:</h4>
            <div class="sliderlol">
              <v-slider
                class="controladorV"
                v-model="media"
                thumb-label
                color="grey"
              ></v-slider>
            </div>
            <span class="porcentaje">{{ media }}%</span>
          </div>
          <div class="dictate-container">
            <v-btn
              outlined
              class="boton playBoton"
              @click="nuevoDictado('corrido')"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              outlined
              class="boton pauseBoton"
              @click="pausarDictado"
            >
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn
              outlined
              class="boton stopBoton"
              @click="detenerDictado"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </div>
          <v-textarea
            name="input-7-1"
            filled
            label="Escribe tu texto aquí"
            auto-grow
            class="text-area"
            v-model="textoDictado"
          ></v-textarea>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container class="container">
          <div class="dictate-container">
            <v-btn
              outlined
              class="boton microBoton"
              @click="iniciarDictado"
            >
              <v-icon>mdi-microphone</v-icon>
            </v-btn>
          </div>
          <v-textarea
            name="input-7-2"
            filled
            label="Texto dictado"
            auto-grow
            class="text-area"
            v-model="textoDictadoMicrofono"
          ></v-textarea>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-footer color="black" dark padless>
      <v-col class="text-center" cols="12">
        <span>Instagram: </span>
        <a
          href="https://www.instagram.com/Foster.js"
          target="_blank"
          class="instagram-link"
          >Foster.js</a
        >
      </v-col>
    </v-footer>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tab: null,
      textoDictado: "Dictador de voz para ti",
      textoDictadoMicrofono: "",
      media: 9, // Valor por defecto para el slider de velocidad
      synth: null,
      utterance: null,
      recognition: null,
    };
  },
  mounted() {
    this.synth = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();

    // Verificar compatibilidad y configurar reconocimiento de voz
    try {
      this.recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      this.recognition.lang = "es-ES";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.textoDictadoMicrofono +=
              event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        this.textoDictadoMicrofono = interimTranscript;
      };

      this.recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz:", event.error);
        alert("Error en el reconocimiento de voz: " + event.error);
      };
    } catch (error) {
      console.error(
        "El reconocimiento de voz no está disponible en este navegador:",
        error
      );
      alert("El reconocimiento de voz no está disponible.");
    }
  },
  methods: {
    nuevoDictado(tipo) {
      let newText = this.textoDictado;

      if (tipo === "escolar") {
        const words = this.textoDictado.split(" ");
        const repeatedPhrases = [];

        for (let i = 0; i < words.length; i += 4) {
          const phrase = words.slice(i, i + 4).join(" ");
          repeatedPhrases.push(phrase);
        }

        const overlappedPhrases = [];
        repeatedPhrases.forEach((phrase) => {
          overlappedPhrases.push(phrase + ", " + phrase);
        });

        newText = overlappedPhrases.join(", ");
      }

      this.utterance.text =
        tipo === "escolar" ? "uno, dos, tres, " + newText : newText;
      this.utterance.rate = this.media / 50;
      this.synth.speak(this.utterance);
    },
    pausarDictado() {
      if (this.synth.paused) {
        this.synth.resume();
      } else {
        this.synth.pause();
      }
    },
    detenerDictado() {
      if (this.synth.speaking) {
        this.synth.cancel();
      }
    },
    iniciarDictado() {
      if (this.recognition) {
        this.textoDictadoMicrofono = "";
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            this.recognition.start();
          })
          .catch((error) => {
            console.error("Error al acceder al micrófono:", error);
            alert(
              "No se puede acceder al micrófono. Asegúrate de haber otorgado permisos."
            );
          });
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Roboto", sans-serif;
}

.pantalla {
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  background-color: black;
  color: white;
  border-radius: 8px;
}

.titulo {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
}

.container {
  padding: 20px;
}

.tab-item {
  color: white;
}

.velocity {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.velocidad-texto {
  margin-bottom: 10px;
  text-align: center; /* Añadido para centrar el texto */
}

.sliderlol {
  width: 200px;
  margin-bottom: 10px;
}

.porcentaje {
  font-size: 0.8em;
  text-align: center; /* Añadido para centrar el texto */
}

.dictate-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.boton {
  border: none;
  color: white;
}

.playBoton {
  background-color: #28a745;
}

.pauseBoton {
  background-color: #ffc107;
}

.stopBoton {
  background-color: #dc3545;
}

.microBoton {
  background-color: #17a2b8;
}

.text-area {
  background-color: #7abcff;
  color: white;
}
.instagram-link {
  color: #17a2b8; /* Color del enlace de Instagram */
  text-decoration: none; 
}

.instagram-link:hover {
  text-decoration: underline; 
}

/* Estilos para dispositivos móviles */
@media (max-width: 600px) {
  .pantalla {
    width: 90%;
    padding: 10px 0;
  }

  .dictate-container {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .sliderlol {
    width: 100%;
  }
}
</style>