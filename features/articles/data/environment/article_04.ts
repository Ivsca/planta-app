import { Article } from "../../types";


export const ARTICLE_4: Article = {
  id: "consumo-agua",
  category: "environment",
  title: "Consumo de agua en el hogar: mitos y realidad",
  slides: [
    {
      id: "1",
      type: "hook",
      title: "¿Sabes cuánta agua gastas realmente?",
      subtitle: "Descubre los mitos del consumo de agua y aprende a identificar fugas invisibles que disparan tu factura.",
      heroImage: require("../../../../assets/images/agua.jpg")

    },
    {
      id: "2",
      type: "concept",
      title: "El Agua que se Escapa sin que lo Notes",
      subtitle: "El consumo medio por persona es de 136 litros diarios, pero las fugas pueden desperdiciar 112 litros adicionales por hogar cada día",
      bullets: [
        {
          icon: "water-drop",
          title: "¿Dónde se va el agua en casa?",
          body: "El baño es el gran responsable del consumo doméstico. La ducha o baño supone un tercio del total (34%), seguido del inodoro (21%) y el lavabo (18%). En conjunto, en el baño consumimos casi las tres cuartas partes del agua del hogar. El 19% corresponde a la cocina y solo un 8% a otros usos domésticos. Conocer estos datos es el primer paso para identificar dónde podemos ahorrar.",
        },
        {
          icon: "eco",
          title: "Mito 1: La botella en la cisterna siempre funciona",
          body: "Colocar una botella llena dentro del tanque del inodoro es un truco popular para ahorrar agua. ¿La realidad? Sí funciona y puede ahorrar aproximadamente un litro por descarga, especialmente en cisternas antiguas. Sin embargo, si se coloca mal, puede interferir con el mecanismo de descarga y causar fugas, convirtiendo un ahorro aparente en un gasto mayor. Además, puede dañar el sistema sanitario si obstruye su funcionamiento. La alternativa más segura son los sistemas de doble descarga, que ahorran hasta 4.000 litros al año.",
        },
        {
          icon: "park",
          title: "Mito 2: Lavar los platos a mano ahorra más agua",
          body: "Parece lógico pensar que lavar a mano consume menos que un electrodoméstico, pero la realidad es la contraria. Un lavavajillas moderno consume entre 10 y 15 litros por ciclo (y solo 10 litros en modo ecológico). Lavar la misma cantidad de vajilla a mano puede gastar hasta 119 litros si dejamos el grifo abierto. La clave está en usar el lavavajillas siempre a carga completa y, si lavas a mano, llenar la pila en lugar de dejar correr el agua: así usarás menos de 20 litros y ahorrarás casi 80 por cada fregado.",
        },
        {
          icon: "eco",
          title: "Mito 3: Una gotera no es tan grave",
          body: "Una pequeña gotera que apenas gotea parece insignificante, pero es una de las mayores trampas en la factura del agua. Un grifo que gotea desperdicia 15 litros al día, lo que equivale a 5.500 litros al año. Si la abertura es de apenas 1mm, la pérdida asciende a 150 litros diarios; con 2mm, 325 litros; y con 6mm, ¡3.500 litros al día!. Las fugas representan aproximadamente el 12% del consumo total y son la causa más común de facturas elevadas. Detectar y reparar fugas a tiempo es la medida de ahorro más efectiva.",
        },
        {
          icon: "eco",
          title: "Datos clave para tomar conciencia",
          body: "Para entender la magnitud del consumo, aquí hay cifras concretas: una lavadora gasta 50 litros por ciclo; un lavavajillas moderno, 14 litros (10 en modo eco); el inodoro, 5 litros por descarga (9 en modelos antiguos); lavarse las manos con grifo abierto consume 6 litros por minuto. Según Naciones Unidas, más de 800 millones de personas viven con menos de 50 litros al día. Nuestro consumo medio de 136 litros diarios es un privilegio que conlleva una gran responsabilidad.",
        },
      ],
    },
    {
      id: "3",
      type: "example",
      title: "Cómo se siente en la vida real",
      before: "Recibir la factura del agua y no entender por qué ha subido tanto si 'no gastas más de lo normal'. Escuchar una pequeña gotera en el baño y pensar 'ya la arreglaré el mes que viene'.",
      after: "Revisar la factura y ver cómo el consumo se reduce mes a mes. Detectar a tiempo una fuga en el inodoro con colorante, repararla tú mismo con un tutorial, y saber que no estás desperdiciando miles de litros sin saberlo.",
      beforeImage: require("../../../../assets/images/factura.jpg"),
      afterImage: require("../../../../assets/images/botella.jpg"),
    },
    {
      id: "4",
      type: "action",
      title: "Ponlo en práctica",
      actions: [
        "Haz la prueba del colorante en el inodoro para detectar fugas invisibles",
        "Cierra el grifo mientras te lavas los dientes o enjabonas (ahorras 6 litros por minuto)",
        "Reduce tus duchas a 5 minutos (pon una playlist y acaba con ella)",
        "Recoge el agua fría de la ducha mientras esperas que caliente para regar plantas",
        "Usa siempre carga completa en lavadora y lavavajillas [citation:1]",
        "Revisa grifos y tuberías una vez al mes: un grifo que gotea pierde 5.500 litros al año",
        "Lava el coche con cubo en lugar de manguera: 30 litros frente a 250",
        "Reutiliza el agua de lavar verduras o cocer pasta para regar",
      ],
    },
    {
    id: "5",
    type: "quiz",
    title: "Mini Quiz: Consumo de Agua",
    questions: [
      {
        prompt:
          "¿Cuántos litros de agua pierde al año un grifo que gotea?",
        options: [
            { title: "Unos 500 litros" },
            { title: "Aproximadamente 5.500 litros" },
            { title: "Más de 10.000 litros" },
            { title: "apenas 100 litros" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: un grifo que gotea puede desperdiciar 15 litros al día, lo que suma 5.500 litros en un año",
      },
      {
        prompt:
          "¿Cuántos litros por minuto gasta una ducha con grifo monomando?",
        options: [
            { title: "3 litros por minuto" },
            { title: "5 litros por minuto" },
            { title: "8 litros por minuto" },
            { title: "13 litros por minuto" },
        ],
        correctIndex: 1,
        explanation:
          "Correcto: una ducha monomando consume 8 litros por minuto, mientras que una de hidromasaje gasta 13 y una eléctrica solo 5",
      },
      {
        prompt:
          "¿Cuál es el consumo medio diario de agua por persona en un hogar?",
        options: [
            { title: "50 litros" },
            { title: "90 litros" },
            { title: "136 litros" },
            { title: "200 litros" },
        ],
        correctIndex: 2,
        explanation:
          "Correcto: una persona consume una media de 136 litros por día, según datos de la Fundación Aquae",
      },
    ],
  }

  ],
};
