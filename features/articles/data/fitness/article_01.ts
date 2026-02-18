import { Article } from "../../types";

export const ARTICLE_1: Article = {
  id: "fuerza",
  category: "fitness",
  title: "Fuerza de base: la clave para una vida larga y activa",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Sabías que el músculo es tu órgano endocrino más grande?",
      subtitle: "Olvídate de los mitos. Entrenar fuerza no es solo para culturistas; es la píldora anti-envejecimiento más eficaz que existe y está al alcance de todos.",
      heroImage: require("../../../../assets/images/pesas.jpg")
    },
    {
      id: "2",
      type: "concept",
      title: "¿Qué es la fuerza y por qué necesitas entrenarla?",
      subtitle: "Más allá de levantar peso, la fuerza es la cualidad que te permite moverte con soltura, prevenir lesiones y gobernar tu metabolismo",
      bullets: [
        {
          icon: "eco",
          title: "La ciencia de la fuerza",
          body: "El entrenamiento de fuerza es un método que utiliza la resistencia (con el propio peso, mancuernas, kettlebells o máquinas) para aumentar la fuerza y el tamaño de los músculos. Su objetivo es proporcionar un estímulo al cuerpo para que éste se adapte y se vuelva más fuerte. No se trata solo de verse bien, sino de construir un cuerpo capaz y resistente.",
        },
        {
          icon: "restore-from-trash",
          title: "Beneficios que van más allá del espejo",
          body: "Los beneficios son masivos y están respaldados por la ciencia. El músculo es el órgano endocrino más grande del cuerpo: cuando se estimula, libera sustancias que se comunican con el hígado, el cerebro y la grasa corporal, mejorando tu salud de forma sistémica. Entre sus beneficios se incluyen: aumento de la masa muscular y la densidad ósea (clave para prevenir la osteoporosis), mejora de la composición corporal y el metabolismo (el músculo quema más calorías en reposo), reducción del colesterol y mejora de la postura",
        },
        {
          icon: "park",
          title: "Salud metabólica y longevidad",
          body: "A partir de los 30 años, perdemos entre un 3% y un 8% de nuestra masa muscular por década. Este proceso, llamado sarcopenia, tiene consecuencias graves: menor movilidad, mayor riesgo de caídas y un metabolismo más lento. Entrenar fuerza es la única forma efectiva de combatirlo. Un cuerpo fuerte es un cuerpo preparado para el futuro, capaz de mantener una vida independiente y activa durante más años.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "El viaje del principiante: de la inseguridad a la confianza",
      before: "Entrar al gimnasio y no saber por dónde empezar. Ver las máquinas como artefactos extraños. Hacer ejercicios sin sentir los músculos trabajar, con miedo a lesionarte o a hacer el ridículo. Crees que 'levantar pesado es solo para hombres' o que 'te vas a lesionar'.",
      after: "Caminar con seguridad hacia la zona de pesas sabiendo exactamente qué ejercicios hacer. Sientes cómo tus músculos trabajan en cada movimiento. Has aprendido a escuchar a tu cuerpo, a distinguir entre esfuerzo y dolor, y a progresar de forma controlada. La fuerza se ha convertido en tu aliada para la salud y la confianza en ti mismo.",
      beforeImage: require("../../../../assets/images/chica.jpg"),
      afterImage: require("../../../../assets/images/hola.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Checklist: Guía de Supervivencia para tu Primera Semana de Fuerza",
      actions: [
        "Olvídate de las máquinas raras: céntrate en patrones de movimiento básicos (sentadilla, flexión, press, remo).",
        "Empieza con ejercicios de peso corporal o cargas muy ligeras para dominar la técnica.",
        "Calienta siempre antes: 5-10 minutos de movilidad articular y cardio suave.",
        "Enfócate en 2-3 sesiones de cuerpo completo (full body) por semana, con un descanso de al menos 48 horas entre ellas.",
        "Realiza de 2 a 3 series de 8 a 12 repeticiones por ejercicio. La última repetición debe ser difícil, pero no imposible.",
      ],
    },
    {
    id: "5",
    type: "quiz",
    title: "Mini Quiz: ¿Listo para empezar a entrenar fuerza?",
    questions: [
      {
        prompt:
          "¿Cuál es el principal beneficio del entrenamiento de fuerza para la salud a largo plazo?",
        options: [
            { title: "Ponerte enorme como un culturista" },
            { title: "Combatir la pérdida de masa muscular y ósea asociada a la edad" },
            { title: "Poder correr una maratón" },
            { title: "Perder peso solo en la zona abdominal" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: El entrenamiento de fuerza es la herramienta más eficaz para combatir la sarcopenia (pérdida de músculo) y la osteoporosis (pérdida de densidad ósea), garantizando una vejez activa y autónoma",
      },
      {
        prompt:
          "¿Con qué frecuencia debería entrenar un principiante para ver resultados?",
        options: [
            { title: "Todos los días para progresar rápido" },
            { title: "2 o 3 veces por semana, con descanso entre sesiones" },
            { title: "Una vez a la semana es suficiente" },
            { title: "Solo cuando te apetezca, sin estructura" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: Con 2 o 3 sesiones de cuerpo completo por semana es más que suficiente para un principiante. El descanso es tan importante como el entrenamiento, ya que es cuando el músculo se repara y se fortalece",
      },
      {
        prompt:
          "¿Qué tipo de ejercicios son los más recomendados para un principiante?",
        options: [
            { title: "Solo máquinas de aislamiento para trabajar un músculo a la vez" },
            { title: "Ejercicios multiarticulares (compuestos) que implican varios grupos musculares" },
            { title: "Ejercicios de aislamiento con mancuernas muy pesadas" },
            { title: "Ejercicios cardiovasculares de baja intensidad" },
        ],
        correctIndex: 2,
        explanation:
          "Correcto: Ejercicios como las sentadillas, flexiones, presses y remos son multiarticulares y enseñan al cuerpo a moverse como una unidad funcional, son más eficientes y generan una mayor respuesta hormonal y de fuerza que los ejercicios de aislamiento",
      },
    ],
  }

  ],
};
