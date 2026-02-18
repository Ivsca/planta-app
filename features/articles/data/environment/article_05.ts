import { Article } from "../../types";

export const ARTICLE_5: Article = {
  id: "microplasticos",
  category: "environment",
  title: "Microplásticos: el plástico invisible que consumimos",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Sabes que comes una tarjeta de crédito a la semana?",
      subtitle: "Microplásticos: el contaminante invisible que ya está en tu sangre, tus órganos y tu mesa.",
      heroImage: require("../../../../assets/images/microplasticos-agua.jpg")
    },
    {
      id: "2",
      type: "concept",
      title: "El Plástico que no Vemos",
      subtitle: "Cada semana ingerimos 5 gramos de plástico, el equivalente a una tarjeta de crédito [citation:1][citation:9].",
      bullets: [
        {
          icon: "eco",
          title: "¿Qué son los microplásticos?",
          body: "Los microplásticos son fragmentos de plástico más pequeños de 5 milímetros, aproximadamente del tamaño de una semilla de sésamo [citation:4]. Existen también los nanoplásticos, aún más diminutos —medidos en milmillonésimas de metro— e invisibles al ojo humano [citation:4]. Se clasifican en dos tipos: los primarios, que son añadidos intencionadamente a productos como cosméticos, exfoliantes o dentífricos, y los secundarios, que resultan de la degradación de objetos plásticos más grandes (bolsas, botellas, redes de pesca) por acción del sol, el calor o la fricción [citation:1][citation:5].",
        },
        {
          icon: "favorite",
          title: "¿Dónde se esconden? Agua, sal y alimentos",
          body: "Están en todas partes. El agua embotellada es una de las principales fuentes: alrededor del 93% de las botellas de agua pueden estar contaminadas con microplásticos, con niveles hasta el doble que los del agua del grifo [citation:6]. La sal de mesa también los contiene: más del 90% de la sal del mundo tiene microplásticos, y la sal marina es la más contaminada [citation:9]. Un adulto que consume 10 gramos de sal al día ingiere unas 2.000 partículas de microplástico al año solo por esta vía [citation:9]. También están presentes en la miel, el azúcar, la cerveza y los mariscos [citation:6]. En los bivalvos (mejillones, ostras), un europeo puede consumir hasta 11.000 microplásticos al año [citation:5].",
        },
        {
          icon: "park",
          title: "Fuentes inesperadas: tablas de cortar y teteras",
          body: "No solo los alimentos vienen contaminados: nosotros mismos generamos microplásticos al cocinar. Un estudio detectó 1.114 partículas de microplástico cada vez que se usó una tabla de cortar de plástico para picar zanahorias [citation:6]. Calentar alimentos en recipientes de plástico, especialmente en el microondas, libera millones de partículas [citation:6]. Las botellas de plástico para bebés también son una fuente preocupante: un bebé de 12 meses puede llegar a ingerir 1,6 millones de partículas al día solo por el biberón [citation:1]. Las bolsitas de té, los envases de comida para llevar y hasta el polvo de nuestra casa contienen microfibras de plástico que respiramos [citation:4][citation:6].",
        },
        {
          icon: "house",
          title: "¿Cómo entran en nuestro cuerpo?",
          body: "Hay tres vías principales de entrada. La ingestión es la más importante: a través de comida y agua contaminadas, ingerimos entre 39.000 y 52.000 partículas al año [citation:5]. La inhalación nos expone a entre 26 y 130 partículas de microplástico al día presentes en el aire, especialmente en interiores, donde la concentración puede ser hasta 100 veces mayor que en exteriores [citation:5]. Por último, el contacto dérmico a través de cosméticos, cremas o ropa sintética, aunque es la vía menos significativa [citation:5]. Una vez dentro, los microplásticos pueden atravesar el tracto digestivo, y los nanoplásticos, por su diminuto tamaño, cruzan membranas celulares y llegan al torrente sanguíneo, acumulándose en órganos como el hígado, los riñones, la placenta, los testículos o el cerebro [citation:5][citation:7].",
        },
        {
          icon: "directions_bike",
          title: "¿Qué efectos tienen en nuestra salud?",
          body: "La investigación está en sus primeras fases, pero los resultados son preocupantes. Los microplásticos provocan estrés oxidativo (daño celular), inflamación y citotoxicidad (muerte celular) [citation:5]. Pueden alterar el microbioma intestinal, dañar la barrera intestinal y provocar trastornos metabólicos [citation:1]. Actúan como disruptores endocrinos: sustancias como el BPA o los ftalatos que contienen imitan a las hormonas humanas, afectando al sistema reproductivo y nervioso [citation:4]. Un estudio de 2024 encontró que los pacientes con microplásticos detectables en la placa de la arteria carótida tenían mayor riesgo de infarto, ictus o muerte [citation:6]. También se han relacionado con problemas respiratorios (asma, inflamación pulmonar), daños en el ADN y potencial carcinogénico [citation:2][citation:7].",
        },
        {
          icon: "delete",
          title: "El reto: una semana sin plástico",
          body: "Reducir los microplásticos es posible, aunque requiere conciencia y pequeños cambios. El desafío 'Una semana sin plástico' consiste en evitar todo plástico de un solo uso durante siete días: nada de botellas, bolsas, envases, pajitas o cubiertos desechables [citation:3]. La periodista que lo intentó para la NPR descubrió que lo más difícil son los plásticos invisibles: las etiquetas de las frutas, los precintos de los tapones, las ventanas de celofán en las cajas de pasta [citation:3]. Para lograrlo, hay que comprar a granel con bolsas de tela, llevar tarros propios para la carnicería o pescadería, y cocinar casi todo desde cero. El resultado: en una semana evitó 27 envases de plástico [citation:3]. No se trata de ser perfecto, sino de tomar conciencia de lo omnipresente que es el plástico en nuestras vidas.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "Cómo se siente en la vida real",
      before: "Calentar la sopa del tupper de plástico en el microondas sin pensarlo. Picar verduras en la tabla de plástico de toda la vida. Beber agua de botellas de plástico reutilizadas varias veces. Pensar que 'si no lo veo, no existe'.",
      after: "Descubrir que cada acción cotidiana libera miles de partículas invisibles. Cambiar a tablas de madera, vidrio o bambú. Usar solo envases de vidrio para calentar comida. Beber agua filtrada en botella de acero inoxidable. Sentir que, aunque no lo veas, estás protegiendo tu salud.",
      beforeImage: require("../../../../assets/images/tupper-plastico.jpg"),
      afterImage: require("../../../../assets/images/vidrio-acero.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Checklist: Reto 1 semana sin plástico",
      actions: [
        "Cambia tu botella de plástico por una de acero inoxidable o vidrio [citation:4]",
        "Usa tablas de cortar de madera, bambú o vidrio (las de plástico liberan partículas) [citation:6]",
        "Nunca calientes comida en recipientes de plástico (pasa siempre a vidrio) [citation:6]",
        "Filtra el agua del grifo (filtros certificados reducen microplásticos) [citation:4]",
        "Compra a granel con tus propias bolsas de tela y tarros [citation:3]",
        "Evita cosméticos con microesferas (exfoliantes, pastas dentífricas) [citation:1]",
        "Ventila y pasa el aspirador a menudo: el polvo doméstico contiene microfibras [citation:6]",
        "Elige ropa de fibras naturales (algodón, lino, lana) frente a sintéticas [citation:4]",
        "Lleva tus propias bolsas de tela siempre, no solo para la compra grande [citation:8]",
        "Di no a pajitas, cubiertos y vasos de un solo uso [citation:8]",
      ],
    },
    {
      id: "5",
      type: "quiz",
      title: "Mini Quiz: Microplásticos",
      questions: [
        {
          prompt: "¿Cuánto plástico ingerimos de media cada semana, según la Universidad de Newcastle?",
          options: [
            { title: "1 gramo, como un clip" },
            { title: "5 gramos, el peso de una tarjeta de crédito" },
            { title: "10 gramos, como dos monedas" },
            { title: "Ninguno, los microplásticos no se ingieren" },
          ],
          correctIndex: 1,
          explanation: "Correcto: cada semana ingerimos unos 5 gramos de plástico, el equivalente a una tarjeta de crédito [citation:1][citation:9].",
        },
        {
          prompt: "¿Cuál es la principal fuente de ingesta de microplásticos?",
          options: [
            { title: "El aire que respiramos" },
            { title: "El agua embotellada" },
            { title: "Los cosméticos" },
            { title: "La ropa sintética" },
          ],
          correctIndex: 1,
          explanation: "Correcto: el agua embotellada es la principal fuente, con niveles hasta el doble de microplásticos que el agua del grifo. Alrededor del 93% de las botellas están contaminadas [citation:6].",
        },
        {
          prompt: "¿Qué objeto cotidiano libera más de 1.000 partículas de microplástico cada vez que se usa?",
          options: [
            { title: "Una sartén antiadherente" },
            { title: "Una tabla de cortar de plástico" },
            { title: "Una bolsa de tela reutilizable" },
            { title: "Un vaso de vidrio" },
          ],
          correctIndex: 1,
          explanation: "Correcto: al usar una tabla de plástico para picar zanahorias, se liberaron 1.114 partículas de microplástico en un solo estudio [citation:6].",
        },
        {
          prompt: "¿En qué órganos humanos se han encontrado microplásticos?",
          options: [
            { title: "Solo en el estómago" },
            { title: "En pulmones, sangre, placenta, hígado y testículos" },
            { title: "Únicamente en la piel" },
            { title: "No se han encontrado en humanos" },
          ],
          correctIndex: 1,
          explanation: "Correcto: se han detectado microplásticos en sangre, pulmones, heces, placenta, hígado, colon, testículos, útero y hasta en el cerebro [citation:5][citation:7].",
        },
        {
          prompt: "¿Qué efecto pueden tener los microplásticos en nuestra salud?",
          options: [
            { title: "Ninguno, son inertes" },
            { title: "Disrupción hormonal, inflamación y daño celular" },
            { title: "Solo problemas estéticos" },
            { title: "Mejoran la digestión" },
          ],
          correctIndex: 1,
          explanation: "Correcto: los microplásticos pueden actuar como disruptores endocrinos (alterando hormonas), provocar inflamación, estrés oxidativo y daño celular. Un estudio los asoció con mayor riesgo cardiovascular [citation:2][citation:4][citation:6].",
        },
        {
          prompt: "¿Qué tipo de sal contiene más microplásticos?",
          options: [
            { title: "Sal del Himalaya" },
            { title: "Sal marina" },
            { title: "Sal de manantial" },
            { title: "Sal refinada de mesa" },
          ],
          correctIndex: 1,
          explanation: "Correcto: la sal marina es la más contaminada por microplásticos, seguida de la sal de lago y la sal de roca [citation:9].",
        },
        {
          prompt: "¿Cuántos microplásticos puede ingerir un bebé al día solo por el biberón?",
          options: [
            { title: "Unos 100" },
            { title: "Hasta 1,6 millones de partículas" },
            { title: "Ninguno, los biberones son seguros" },
            { title: "Unos 10.000" },
          ],
          correctIndex: 1,
          explanation: "Correcto: un estudio publicado en Nature Food estimó que un bebé de 12 meses puede ingerir una media de 1,6 millones de partículas de microplástico al día solo por el uso del biberón [citation:1].",
        },
        {
          prompt: "¿Verdadero o falso? El aire de nuestras casas puede estar más contaminado por microplásticos que el exterior.",
          options: [
            { title: "Falso, el exterior siempre está más contaminado" },
            { title: "Verdadero, la concentración interior puede ser hasta 100 veces mayor" },
            { title: "Falso, no hay microplásticos en el aire" },
            { title: "Verdadero, pero solo si vives cerca de una fábrica" },
          ],
          correctIndex: 1,
          explanation: "Correcto: la concentración de microplásticos en interiores puede ser de 0,4 a 156,5 partículas por metro cúbico, muy superior a la del exterior (0,3 a 1,5) [citation:5]. Proceden de muebles, ropa y textiles sintéticos.",
        },
      ],
    },
  ],
};