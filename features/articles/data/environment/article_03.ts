import { Article } from "../../types";


export const ARTICLE_3: Article = {
  id: "contaminacion-aire",
  category: "environment",
  title: "Contaminación del aire y salud humana",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Qué respiras cuando sales a la calle?",
      subtitle: "Descubre cómo la contaminación del aire afecta tu salud y qué puedes hacer para protegerte.",
      heroImage: require("../../../../assets/images/aire.jpg")

    },
    {
      id: "2",
      type: "concept",
      title: "El Aire que Respiramos",
      subtitle: "La contaminación atmosférica es uno de los mayores riesgos ambientales para la salud human",
      bullets: [
        {
          icon: "eco",
          title: "Impacto Silencioso en tu Salud",
          body: "La contaminación del aire es una realidad que afecta a millones de personas, especialmente en núcleos urbanos donde los niveles de polución son más altos. Según la Organización Mundial de la Salud, la contaminación del aire ambiente provoca cada año 4,2 millones de muertes prematuras en todo el mundo, convirtiéndose en uno de los mayores riesgos ambientales para la salud. El 99% de la población mundial vive en lugares donde no se respetan las directrices de calidad del aire establecidas por la OMS, lo que significa que prácticamente todos respiramos aire contaminado a diario. Este problema no entiende de fronteras: los contaminantes emitidos en un país pueden transportarse en la atmósfera y afectar la calidad del aire en otras partes del mundo.",
        },
        {
          icon: "eco",
          title: "Cómo Afecta a tus Pulmones y Corazón",
          body: "La exposición permanente a la contaminación atmosférica supone una enorme merma para nuestra salud. Los efectos más inmediatos se manifiestan en el sistema respiratorio: tos, irritación de garganta, opresión en el pecho, sibilancias y dificultad para respirar son síntomas comunes a corto plazo. Pero el daño va más allá: las partículas finas (PM2.5) y ultrafinas (PM0.1) pueden penetrar profundamente en los pulmones, atravesar la barrera pulmonar y llegar al torrente sanguíneo. Una vez en la sangre, estas partículas aumentan el riesgo de enfermedades cardiovasculares como cardiopatías isquémicas, accidentes cerebrovasculares, arritmias e infartos. Se estima que aproximadamente el 68% de las muertes prematuras relacionadas con la contaminación del aire exterior se deben a problemas cardiovasculares, y hasta un 20% de toda la mortalidad cardiovascular podría atribuirse a la contaminación ambiental.",
        },
        {
          icon: "park",
          title: "Grupos Vulnerables y Efectos a Largo Plazo",
          body: "Aunque todos estamos expuestos, hay grupos especialmente vulnerables a la contaminación del aire. Los niños son más susceptibles porque sus pulmones aún se están desarrollando, pasan más tiempo al aire libre y respiran más rápido que los adultos. Los ancianos y las personas con afecciones preexistentes como asma, enfermedades cardíacas, diabetes u obesidad también enfrentan mayores riesgos. La exposición prolongada puede perjudicar el desarrollo pulmonar en los niños y contribuir al asma en la primera infancia. Además, ciertas sustancias tóxicas del aire como el benceno, el mercurio o el asbesto pueden aumentar el riesgo de cáncer, y las partículas de los gases de escape diésel se consideran el principal cancerígeno transmitido por el aire en muchas regiones. Incluso la exposición a microplásticos, un contaminante emergente, se ha asociado recientemente con mayor riesgo de infarto, ictus y muerte cardiovascular.",
        },
        {
          icon: "eco",
          title: "Plantas en Casa y Aire Interior",
          body: "El aire de nuestros hogares también puede estar contaminado, y las acciones que realizamos dentro influyen en el aire que respiramos y en el que devolvemos al exterior. Tener plantas de interior ayuda a renovar el aire de forma natural y efectiva, ya que absorben dióxido de carbono y liberan oxígeno, además de recolectar contaminantes en la superficie de sus hojas. Ventilar la casa a diario es fundamental para mejorar la calidad del aire interior y eliminar el aire viciado. Al cocinar, especialmente si fríes alimentos, abre las ventanas y usa extractores de humo, ya que las frituras producen una gran polución doméstica. Evita fumar en espacios cerrados y, si es posible, utiliza purificadores de aire, que ayudan a prevenir alergias y mitigar sus síntomas.",
        },
        {
          icon: "eco",
          title: "Evita Quemas y Productos Tóxicos",
          body: "Pequeñas acciones cotidianas pueden contribuir significativamente a reducir la contaminación del aire. Evita las quemas al aire libre, ya sea de basura, hojas o biomasa, porque liberan partículas y sustancias nocivas que agravan la polución atmosférica. Reduce el uso de productos químicos tóxicos en tu hogar: muchos productos de limpieza, pinturas, disolventes y ambientadores contienen compuestos orgánicos volátiles (COV) que se evaporan fácilmente y contaminan el aire interior y exterior. Opta por alternativas ecológicas y respetuosas con el medio ambiente. Reciclar correctamente también ayuda: al aprovechar los recursos, se reducen los procesos de fabricación que generan gases nocivos para la atmósfera. Por último, consume productos sostenibles y reduce el consumo de carne en tu dieta, ya que la producción intensiva de alimentos también contribuye a las emisiones contaminantes.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "Cómo se siente en la vida real",
      before: "Despertar con congestión nasal, tos persistente y ojos irritados, especialmente en días de mucho tráfico. Notar que al hacer ejercicio al aire libre te falta el aire y sientes opresión en el pecho.",
      after: "Respirar profundamente sin molestias al salir a la calle, poder hacer ejercicio en parques sin sentir que el aire pesa, y notar que tus alergias estacionales se han reducido notablemente.",
      beforeImage: require("../../../../assets/images/enfermo.jpg"),
      afterImage: require("../../../../assets/images/respirar.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Ponlo en práctica",
      actions: [
         "Camina o usa bicicleta para trayectos cortos en lugar del coche",
        "Ventila tu casa a diario durante 10-15 minutos",
        "Incorpora plantas de interior que purifiquen el aire (como potus o sansevieria)"
      ],
    },
    {
    id: "5",
    type: "quiz",
    title: "Mini Quiz: Contaminación del Aire",
    questions: [
      {
        prompt:
          "¿Cuántas muertes prematuras causa anualmente la contaminación del aire ambiente en el mundo, según la OMS?",
        options: [
            { title: "1,2 millones de muertes" },
            { title: "4,2 millones de muertes" },
            { title: "7,8 millones de muertes" },
            { title: "500.000 muertes" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: la Organización Mundial de la Salud estima que la contaminación del aire ambiente provoca 4,2 millones de muertes prematuras cada año en todo el mundo.",
      },
      {
        prompt:
          "¿Quiénes son los grupos más vulnerables a la contaminación del aire?",
        options: [
            { title: "Solo las personas que fuman" },
            { title: "Los niños, los ancianos y personas con asma o enfermedades cardíacas" },
            { title: "Únicamente quienes viven cerca de fábricas" },
            { title: "Los deportistas de alto rendimiento" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: los niños (porque sus pulmones están en desarrollo), los ancianos y las personas con afecciones respiratorias o cardíacas preexistentes son especialmente vulnerables a los efectos de la contaminación atmosférica.",
      },
      {
        prompt:
          "¿Cuál es una forma efectiva de mejorar la calidad del aire dentro de tu hogar?",
        options: [
            { title: "Mantener todas las ventanas cerradas permanentemente" },
            { title: "Usar ambientadores químicos a diario" },
            { title: "Tener plantas de interior y ventilar la casa diariamente" },
            { title: "Cocinar sin extractor para que el humo se disipe solo" },
        ],
        correctIndex: 2,
        explanation:
          "Correcto: las plantas de interior ayudan a renovar el aire de forma natural absorbiendo CO2 y contaminantes, y ventilar la casa a diario elimina el aire viciado y renueva el oxígeno.",
      },
    ],
  }

  ],
};
