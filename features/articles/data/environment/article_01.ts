import { Article } from "../../types";

export const ARTICLE_1: Article = {
  id: "cambio-climatico",
  category: "environment",
  title: "¿Qué es realmente el cambio climático?",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Qué es realmente el cambio climático?",
      subtitle: "la información de este artículo proviene del sitio oficial de las Naciones Unidas",
      heroUri:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwhgx0MrS4nENTuvCiKXgtYaTCwMQt3f-1MlUuKZ3X_F_rEqlGfUU6eii6oJw90_cnolxvw7HLYcP-E022EUOz2rLYwv1h-sQlhd2KMjkoZm0tnKZDd21iEFs_cnLXNweOVN_yOHMITzBm5mq_gK118GP-sw1i1Afxh_7pK60Fw4NQB9RDFZ8roI4fqisX1G79diNNYLBpPcKl6jlw5fs-JT1TsEs5F1wcFBlUg1oNWSsTcQCy9p34wTxhfu6Qubo7B2hYC4n4eYE5",
    },
    {
      id: "2",
      type: "concept",
      title: "¿Qué es y qué lo provoca?",
      subtitle: "Tres ideas clave para entenderlo sin ruido.",
      bullets: [
        {
          icon: "eco",
          title: "La Naturaleza del Cambio Climático",
          body: "El cambio climático se refiere a las transformaciones profundas y duraderas que experimentan los patrones climáticos del planeta a lo largo de extensos períodos, que pueden abarcar décadas, siglos o incluso milenios. Es importante entender que el clima de la Tierra no es estático; a lo largo de su historia ha sufrido variaciones naturales debido a factores como erupciones volcánicas masivas que llenaban la atmósfera de cenizas, cambios en la radiación solar o alteraciones en la órbita terrestre. Estos procesos naturales ocurrían de manera gradual, permitiendo que los ecosistemas tuvieran tiempo para adaptarse a las nuevas condiciones.",
        },
        {
          icon: "walk",
          title: "El Origen Humano del Problema Actual",
          body: "Sin embargo, lo que hace excepcional y preocupante al fenómeno que vivimos hoy es su vertiginosa aceleración y su origen principal: la actividad humana. Desde la Revolución Industrial, nuestra dependencia de los combustibles fósiles (carbón, petróleo y gas natural) para generar energía, transportarnos y fabricar productos ha crecido de manera descontrolada. Al quemar estos combustibles, liberamos enormes cantidades de gases de efecto invernadero, como el dióxido de carbono (CO2) y el metano, a la atmósfera. Esta liberación masiva y rápida no tiene precedentes en la historia geológica reciente del planeta.",
        },
        {
          icon: "park",
          title: "La Consecuencia: Un Calentamiento Global Acelerado",
          body: "Estos gases actúan como una manta cada vez más gruesa que atrapa el calor del sol, impidiendo que se disipe en el espacio y provocando un calentamiento global que desestabiliza todo el sistema climático. Según las Naciones Unidas, la evidencia científica es abrumadora: las actividades humanas son la causa principal del calentamiento global observado desde mediados del siglo XX, alterando el delicado equilibrio que ha permitido el desarrollo de nuestra civilización y poniendo en riesgo la estabilidad de los ecosistemas y las sociedades tal como las conocemos.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "Cómo se siente en la vida real",
      before: "Dependencia total del coche para moverte a todos lados.",
      after: "Moverte en bicicleta o transporte público sin estrés.",
      beforeImage: require("../../../../assets/images/Trafico.jpg"),
      afterImage: require("../../../../assets/images/bicicleta.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Ponlo en práctica",
      actions: [
        "Camina o usa bici en trayectos cortos",
        "Reduce consumo de energía innecesaria",
        "Compra local cuando sea posible",
      ],
    },
    {
    id: "5",
    type: "quiz",
    title: "Mini Quiz: Cambio Climático",
    questions: [
      {
        prompt:
          "Según el texto, ¿cuál es la principal diferencia entre el cambio climático actual y los cambios climáticos del pasado?",
        options: [
          { title: "El actual es más lento y gradual que los del pasado." },
          { title: "El actual es provocado principalmente por la actividad humana, mientras que los del pasado eran por causas naturales." },
          { title: "El actual solo afecta a las ciudades, mientras que los del pasado afectaban al campo." },
          { title: "En el pasado no existían los combustibles fósiles." },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: el cambio climático actual se acelera por la actividad humana, mientras que en el pasado predominaban causas naturales.",
      },
      {
        prompt:
          "Menciona una consecuencia del cambio climático que afecte directamente el precio de los alimentos.",
        options: [
          { title: "El aumento de la publicidad en televisión." },
          { title: "La reducción de cosechas por sequías o inundaciones." },
          { title: "La apertura de más supermercados en las ciudades." },
          { title: "El incremento de la población mundial." },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: sequías e inundaciones pueden reducir cosechas y subir el precio de los alimentos.",
      },
      {
        prompt:
          "Nombra una de las tres tareas cotidianas que se sugieren para combatir el cambio climático.",
        options: [
          { title: "Comprar un coche nuevo cada año." },
          { title: "Usar más plásticos de un solo uso." },
          { title: "Optar por movilidad sostenible (caminar, bici o transporte público)." },
          { title: "Aumentar el consumo de carne roja." },
        ],
        correctIndex: 2,
        explanation:
          "Correcto: la movilidad sostenible reduce emisiones al evitar transporte motorizado.",
      },
    ],
  }

  ],
};
