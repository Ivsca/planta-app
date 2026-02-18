import { Article } from "../../types";


export const ARTICLE_2: Article = {
  id: "huella-ecologica",
  category: "environment",
  title: "Tu Huella Ecológica",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Cuánta Tierra necesitas para vivir?",
      subtitle: "Entiende tu huella ecológica y cómo reducirla desde hoy.",
      heroImage: require("../../../../assets/images/eco.jpg")

    },
    {
      id: "2",
      type: "concept",
      title: "¿Qué es la Huella Ecológica?",
      subtitle: "La huella ecológica es un indicador que mide el impacto de nuestro estilo de vida sobre el planeta.",
      bullets: [
        {
          icon: "eco",
          title: "Impacto real",
          body: "La huella ecológica es un indicador clave que mide el impacto de nuestras actividades diarias sobre el planeta. Desarrollado en 1996 por Mathis Wackernagel y William Rees, este concepto calcula la superficie ecológicamente productiva —expresada en hectáreas globales— necesaria para producir los recursos que consumimos y para absorber los residuos que generamos. Responde a una pregunta fundamental: ¿cuánta tierra y agua se requiere para mantener nuestro estilo de vida actual? Es una herramienta que nos permite visualizar, de manera tangible, la presión que ejercemos sobre los ecosistemas del planeta.",
        },
        {
          icon: "recycling",
          title: "El Desequilibrio entre Demanda y Capacidad",
          body: "Cuando la huella ecológica de la humanidad supera la biocapacidad del planeta —su capacidad natural para regenerar recursos y absorber desechos— entramos en una situación de 'déficit ecológico'. Esto significa que estamos consumiendo los recursos naturales más rápido de lo que la Tierra puede reponerlos, viviendo literalmente 'a crédito' y comprometiendo el bienestar de las futuras generaciones. La realidad actual es preocupante: a nivel global, la demanda de recursos supera ampliamente la oferta del planeta. Según datos recientes, si todos los habitantes del mundo viviéramos como un europeo medio, necesitaríamos casi tres planetas para satisfacer nuestras necesidades de manera sostenible.",
        },
        {
          icon: "park",
          title: "Estrategias para Reducir tu Huella en Casa",
          body: "Reducir nuestra huella ecológica en el hogar es más sencillo de lo que parece y comienza con pequeños cambios. Apuesta por la eficiencia energética sustituyendo las bombillas tradicionales por iluminación LED, que consume hasta un 80% menos de energía. Combate el 'consumo fantasma' apagando por completo los aparatos electrónicos y desenchufándolos cuando no los uses, ya que el modo stand by sigue consumiendo electricidad. Mejora el aislamiento de tu vivienda con doble cristal en ventanas y un buen sellado en paredes, lo que ayuda a mantener la temperatura natural y reduce la necesidad de calefacción en invierno y aire acondicionado en verano. Si es posible, contrata energía verde proveniente de fuentes renovables como la solar o eólica.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "Cómo se siente en la vida real",
      before: "Llenar el carrito de compras sin pensar, con productos envasados y de temporada equivocada.",
      after: "Elegir productos a granel, locales y de temporada, sintiendo que tu compra también cuida del planeta.",
      beforeImage: require("../../../../assets/images/carro.jpg"),
      afterImage: require("../../../../assets/images/cala.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Ponlo en práctica",
      actions: [
        "Apaga los electrodomésticos por completo, no los dejes en stand by",
        "Lleva siempre tu propia bolsa de tela y botella reutilizable",
        "Separa correctamente los residuos para reciclar en casa",
        "Opta por duchas cortas de 5 minutos en lugar de baños",
      ],
    },
    {
    id: "5",
    type: "quiz",
    title: "Mini Quiz: Huella Ecológica",
    questions: [
      {
        prompt:
          "¿Qué mide exactamente la huella ecológica?",
        options: [
          { title: "La cantidad de dinero que gastamos en productos ecológicos." },
          { title: "La superficie de planeta necesaria para producir lo que consumimos y absorber nuestros residuos." },
          { title: "El número de árboles que debemos plantar para compensar nuestras emisiones." },
          { title: "La cantidad de agua que consume una persona en su vida diaria." },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: la huella ecológica calcula las hectáreas globales necesarias para sostener nuestro estilo de vida, incluyendo tanto la producción de recursos como la absorción de desechos.",
      },
      {
        prompt:
          "¿Qué significa que estemos en situación de 'déficit ecológico'?",
        options: [
          { title: "Que los gobiernos no invierten suficiente dinero en energías renovables." },
          { title: "Que consumimos los recursos más rápido de lo que la Tierra puede regenerarlos." },
          { title: "Que no hay suficientes espacos naturales protegidos en el mundo" },
          { title: "Que la población mundial está disminuyendo drásticamente" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: el déficit ecológico ocurre cuando nuestra huella supera la biocapacidad del planeta, lo que significa que estamos viviendo 'a crédito' y comprometiendo los recursos de las futuras generaciones.",
      },
      {
        prompt:
          "¿Cuál de estas acciones es más efectiva para reducir tu huella ecológica en la alimentación?",
        options: [
          { title: "Comprar siempre productos importados porque son más exóticos." },
          { title: "Reducir el consumo de carne, especialmente la roja." },
          { title: "Elegir alimentos con muchos envases plásticos para conservarlos mejor." },
          { title: "Desperdiciar la comida sin preocuparte porque ya la pagaste." },
        ],
        correctIndex: 2,
        explanation:
          "Correcto: La industria cárnica es una de las que más gases de efecto invernadero genera y requiere enormes cantidades de agua, por lo que reducir su consumo es una de las acciones más impactantes.",
      },
    ],
  }

  ],
};
