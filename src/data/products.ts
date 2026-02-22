import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    barcode: "7790895000812",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    category: "Bebidas",
    emoji: "🥤",
    score: 12,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: true,
    summary:
      "Coca-Cola es una bebida ultraprocesada con altísimo contenido de azúcar: una botella de 500ml tiene 53g, el equivalente a 13 cucharaditas. No aporta ningún nutriente real. Contiene colorante caramelo IV (E150d), que incluye 4-MEI, una sustancia clasificada como posible cancerígeno. El ácido fosfórico puede afectar la absorción de calcio. Evitá el consumo frecuente.",
    nutrition: {
      calories: 42,
      totalFat: 0,
      saturatedFat: 0,
      sodium: 4,
      totalCarbs: 10.6,
      sugars: 10.6,
      fiber: 0,
      protein: 0,
    },
    ingredients: [
      {
        name: "Agua carbonatada",
        riskLevel: "safe",
        description: "Base de la bebida. Agua con dióxido de carbono disuelto, sin riesgo para la salud.",
      },
      {
        name: "Azúcar",
        riskLevel: "risky",
        description:
          "53g por botella de 500ml — ¡13 cucharaditas de azúcar! La OMS recomienda máximo 25g por día. Contribuye a obesidad, diabetes tipo 2 y caries.",
      },
      {
        name: "Color caramelo E150d",
        riskLevel: "risky",
        description:
          "Colorante caramelo IV. Contiene 4-MEI (4-metilimidazol), clasificado por la IARC como posible cancerígeno (Grupo 2B). California exige advertencia en productos con este aditivo.",
      },
      {
        name: "Ácido fosfórico",
        riskLevel: "moderate",
        description:
          "Regulador de acidez que da el sabor ácido. En exceso puede reducir la absorción de calcio y afectar la salud ósea.",
      },
      {
        name: "Saborizantes naturales",
        riskLevel: "safe",
        description: "Mezcla secreta de extractos vegetales y aceites esenciales. No representan un riesgo conocido.",
      },
      {
        name: "Cafeína",
        riskLevel: "moderate",
        description:
          "Estimulante del sistema nervioso (~32mg por lata). Puede causar insomnio, ansiedad y dependencia. No recomendada para niños.",
      },
    ],
    alternatives: [
      { name: "Agua mineral", brand: "Villavicencio", score: 95 },
      { name: "Soda", brand: "Ivess", score: 90 },
    ],
  },
  {
    barcode: "7622300124364",
    name: "Galletitas Variedad",
    brand: "Terrabusi",
    category: "Galletitas",
    emoji: "🍪",
    score: 22,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: true,
    excessCalories: true,
    summary:
      "Las galletitas Variedad de Terrabusi son ultraprocesadas con 3 sellos de advertencia. Tienen alto contenido de azúcar, grasas saturadas de baja calidad y conservantes como el TBHQ. El jarabe de maíz de alta fructosa se asocia con mayor riesgo de hígado graso. No son un buen snack habitual.",
    nutrition: {
      calories: 480,
      totalFat: 20,
      saturatedFat: 10,
      sodium: 350,
      totalCarbs: 68,
      sugars: 24,
      fiber: 2,
      protein: 6,
    },
    ingredients: [
      {
        name: "Harina de trigo",
        riskLevel: "safe",
        description: "Base del producto. Harina refinada, baja en fibra y nutrientes comparada con la integral.",
      },
      {
        name: "Azúcar",
        riskLevel: "risky",
        description: "24g cada 100g — casi un cuarto del producto es azúcar pura. Contribuye a obesidad y caries.",
      },
      {
        name: "Grasa vegetal",
        riskLevel: "risky",
        description:
          "Generalmente aceite de palma. Alto en grasas saturadas, asociado a aumento del colesterol LDL. Su producción también causa deforestación.",
      },
      {
        name: "Jarabe de maíz de alta fructosa",
        riskLevel: "risky",
        description:
          "Endulzante ultraprocesado más barato que el azúcar. Se metaboliza directamente en el hígado y se asocia con hígado graso y resistencia a la insulina.",
      },
      {
        name: "Leche en polvo",
        riskLevel: "safe",
        description: "Fuente de calcio y proteína. Sin riesgo, salvo para personas con intolerancia a la lactosa.",
      },
      {
        name: "Cacao",
        riskLevel: "safe",
        description: "Aporta antioxidantes naturales (flavonoides). En la cantidad presente, beneficio mínimo.",
      },
      {
        name: "Lecitina de soja",
        riskLevel: "safe",
        description: "Emulsionante natural derivado de la soja. Generalmente seguro y muy común en alimentos procesados.",
      },
      {
        name: "Sal",
        riskLevel: "moderate",
        description: "350mg de sodio cada 100g. En exceso contribuye a hipertensión arterial.",
      },
      {
        name: "Saborizantes artificiales",
        riskLevel: "moderate",
        description:
          "Sustancias químicas que imitan sabores. Aunque aprobados, algunos estudios los vinculan a alteraciones en el gusto y preferencia por alimentos ultraprocesados.",
      },
      {
        name: "TBHQ",
        riskLevel: "risky",
        description:
          "Antioxidante sintético (tert-butilhidroquinona). En altas dosis se asocia con efectos negativos en el sistema inmune. Prohibido en Japón y otros países.",
      },
    ],
    alternatives: [
      { name: "Galletitas de arroz", brand: "Molinos", score: 65 },
      { name: "Tostadas integrales", brand: "Breviss", score: 70 },
    ],
  },
  {
    barcode: "7793940100011",
    name: "Leche Entera",
    brand: "La Serenísima",
    category: "Lácteos",
    emoji: "🥛",
    score: 78,
    rating: "Excelente",
    novaGroup: 1,
    excessSugar: false,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: false,
    summary:
      "La leche entera La Serenísima es un alimento natural, sin procesar, y no tiene ningún sello de advertencia. Es fuente natural de calcio, proteínas de alta calidad y vitaminas A y D. Una excelente opción para la alimentación diaria, especialmente para niños y adolescentes en crecimiento.",
    nutrition: {
      calories: 61,
      totalFat: 3.1,
      saturatedFat: 2,
      sodium: 48,
      totalCarbs: 4.7,
      sugars: 4.7,
      fiber: 0,
      protein: 3.1,
    },
    ingredients: [
      {
        name: "Leche entera",
        riskLevel: "safe",
        description:
          "Ingrediente único: leche de vaca pasteurizada. Sin aditivos, sin azúcar agregada. La lactosa es azúcar natural de la leche.",
      },
    ],
    alternatives: [
      {
        name: "Leche descremada",
        brand: "La Serenísima",
        score: 85,
      },
    ],
  },
  {
    barcode: "7790310980019",
    name: "Papas Clásicas",
    brand: "Lay's",
    category: "Snacks",
    emoji: "🥔",
    score: 28,
    rating: "Mediocre",
    novaGroup: 4,
    excessSugar: false,
    excessSodium: true,
    excessFat: true,
    excessSaturatedFat: false,
    excessCalories: true,
    summary:
      "Las Papas Clásicas de Lay's son un snack ultraprocesado con 3 sellos de advertencia: exceso de sodio, grasas y calorías. Un paquete individual ya supera el 25% del sodio diario recomendado. Las grasas representan más de un tercio del producto. Consumí ocasionalmente y en porciones pequeñas.",
    nutrition: {
      calories: 536,
      totalFat: 35,
      saturatedFat: 10,
      sodium: 550,
      totalCarbs: 50,
      sugars: 1,
      fiber: 4,
      protein: 7,
    },
    ingredients: [
      {
        name: "Papas",
        riskLevel: "safe",
        description: "Papa deshidratada y frita. Pierde gran parte de sus nutrientes en el proceso de fritura.",
      },
      {
        name: "Aceite vegetal",
        riskLevel: "moderate",
        description:
          "Mezcla de aceites (generalmente girasol o maíz). Al freír a alta temperatura se generan compuestos potencialmente dañinos como la acrilamida.",
      },
      {
        name: "Sal",
        riskLevel: "moderate",
        description:
          "550mg de sodio cada 100g — muy alto. La OMS recomienda máximo 2000mg/día. Un paquete chico ya aporta mucho.",
      },
      {
        name: "Dextrosa",
        riskLevel: "moderate",
        description:
          "Forma simple de glucosa usada para potenciar el sabor. Es azúcar con otro nombre, aunque en pequeñas cantidades.",
      },
    ],
    alternatives: [
      { name: "Bastones de zanahoria", brand: "Granja del Sol", score: 82 },
      { name: "Maní sin sal", brand: "Marolio", score: 68 },
    ],
  },
  {
    barcode: "7790580511609",
    name: "Bon o Bon",
    brand: "Arcor",
    category: "Golosinas",
    emoji: "🍫",
    score: 8,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: true,
    excessCalories: true,
    summary:
      "Bon o Bon es una golosina ultraprocesada con uno de los peores puntajes. Casi la mitad del producto es azúcar (48g/100g) y contiene grasa vegetal hidrogenada, fuente de grasas trans que aumentan el riesgo cardiovascular. El TBHQ como conservante es controvertido. Una unidad de vez en cuando no es un problema, pero no debería ser un hábito.",
    nutrition: {
      calories: 540,
      totalFat: 33,
      saturatedFat: 18,
      sodium: 80,
      totalCarbs: 55,
      sugars: 48,
      fiber: 2,
      protein: 7,
    },
    ingredients: [
      {
        name: "Azúcar",
        riskLevel: "risky",
        description: "48g cada 100g — casi la mitad del producto es azúcar. Prácticamente una bomba de glucosa.",
      },
      {
        name: "Grasa vegetal hidrogenada",
        riskLevel: "risky",
        description:
          "Fuente de grasas trans artificiales. Aumenta el colesterol malo (LDL), reduce el bueno (HDL) y eleva significativamente el riesgo cardiovascular.",
      },
      {
        name: "Maní",
        riskLevel: "safe",
        description: "Buena fuente de proteínas y grasas saludables. Lo mejor que tiene este producto.",
      },
      {
        name: "Cacao en polvo",
        riskLevel: "safe",
        description: "Aporta sabor y algo de antioxidantes, pero en cantidad insuficiente para beneficio real.",
      },
      {
        name: "Leche en polvo",
        riskLevel: "safe",
        description: "Fuente de calcio y proteínas. Sin riesgo, salvo para intolerantes a la lactosa.",
      },
      {
        name: "Suero de leche",
        riskLevel: "safe",
        description: "Subproducto lácteo rico en proteínas. Usado como relleno barato en la industria alimentaria.",
      },
      {
        name: "Lecitina de soja",
        riskLevel: "safe",
        description: "Emulsionante natural que evita la separación de grasas. Generalmente seguro.",
      },
      {
        name: "Saborizantes artificiales",
        riskLevel: "moderate",
        description: "Químicos que imitan sabores naturales. Aprobados por reguladores, pero mejor evitarlos si hay alternativa.",
      },
      {
        name: "TBHQ",
        riskLevel: "risky",
        description:
          "Conservante sintético (tert-butilhidroquinona). Estudios en animales muestran efectos negativos en el sistema inmune. Prohibido en varios países.",
      },
    ],
    alternatives: [
      { name: "Frutos secos mixtos", brand: "Marolio", score: 75 },
      { name: "Chocolate 70% cacao", brand: "Águila", score: 45 },
    ],
  },
  {
    barcode: "7792798000012",
    name: "Cerveza Quilmes",
    brand: "Quilmes",
    category: "Bebidas",
    emoji: "🍺",
    score: 20,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: false,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: true,
    summary:
      "La Cerveza Quilmes es una bebida alcohólica ultraprocesada. El alcohol aporta calorías vacías (7 kcal/g) sin ningún valor nutricional. El consumo regular de alcohol se asocia con daño hepático, mayor riesgo de cáncer y dependencia. Aunque los ingredientes base son simples (agua, malta, lúpulo), la presencia de alcohol la convierte en un producto de bajo puntaje.",
    nutrition: {
      calories: 42,
      totalFat: 0,
      saturatedFat: 0,
      sodium: 4,
      totalCarbs: 3.5,
      sugars: 0,
      fiber: 0,
      protein: 0.3,
    },
    ingredients: [
      {
        name: "Agua",
        riskLevel: "safe",
        description: "Componente principal (~93%). Sin riesgo alguno.",
      },
      {
        name: "Malta de cebada",
        riskLevel: "safe",
        description: "Cebada germinada y secada. Aporta los azúcares que se fermentan para producir alcohol.",
      },
      {
        name: "Lúpulo",
        riskLevel: "safe",
        description: "Planta que da el amargor y aroma a la cerveza. Tiene propiedades antioxidantes naturales.",
      },
      {
        name: "Levadura",
        riskLevel: "safe",
        description: "Microorganismo que convierte el azúcar en alcohol y CO2. Fuente natural de vitaminas del grupo B.",
      },
      {
        name: "Antioxidante INS 316",
        riskLevel: "moderate",
        description:
          "Eritorbato de sodio. Conservante sintético usado para mantener la frescura. En general bien tolerado, pero es un aditivo innecesario.",
      },
    ],
    alternatives: [
      { name: "Agua mineral con gas", brand: "Villavicencio", score: 95 },
    ],
  },
  {
    barcode: "7795445000019",
    name: "Pan Lactal Blanco",
    brand: "Bimbo",
    category: "Panificados",
    emoji: "🍞",
    score: 42,
    rating: "Mediocre",
    novaGroup: 4,
    excessSugar: false,
    excessSodium: true,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: false,
    summary:
      "El Pan Lactal Bimbo es un panificado ultraprocesado que parece inofensivo pero tiene exceso de sodio (500mg/100g). Usa harina refinada con poco valor nutricional, y contiene propionato de calcio como conservante para extender la vida útil. Un pan de panadería o pan integral casero sería mucho más nutritivo.",
    nutrition: {
      calories: 260,
      totalFat: 3,
      saturatedFat: 1,
      sodium: 500,
      totalCarbs: 50,
      sugars: 6,
      fiber: 3,
      protein: 8,
    },
    ingredients: [
      {
        name: "Harina de trigo",
        riskLevel: "safe",
        description:
          "Harina blanca refinada. Pierde el germen y el salvado en el proceso, quedando con menos fibra y nutrientes que la integral.",
      },
      {
        name: "Agua",
        riskLevel: "safe",
        description: "Segundo ingrediente. Sin riesgo.",
      },
      {
        name: "Azúcar",
        riskLevel: "moderate",
        description: "6g cada 100g. No es excesivo pero es innecesario en el pan. Mejora el sabor y la textura industrial.",
      },
      {
        name: "Levadura",
        riskLevel: "safe",
        description: "Necesaria para la fermentación del pan. Sin riesgo para la salud.",
      },
      {
        name: "Aceite vegetal",
        riskLevel: "moderate",
        description: "Generalmente aceite de soja o girasol. Agrega calorías y grasas que un pan tradicional no tendría.",
      },
      {
        name: "Sal",
        riskLevel: "moderate",
        description: "500mg de sodio cada 100g — alto para un pan. La OMS recomienda máximo 2000mg/día en total.",
      },
      {
        name: "Gluten de trigo",
        riskLevel: "safe",
        description: "Proteína del trigo agregada extra para mejorar la textura. Problema solo para celíacos.",
      },
      {
        name: "Propionato de calcio",
        riskLevel: "moderate",
        description:
          "Conservante (E282) que previene el moho. Algunos estudios lo vinculan con irritabilidad e inquietud en niños sensibles.",
      },
      {
        name: "Lecitina de soja",
        riskLevel: "safe",
        description: "Emulsionante natural de la soja. Generalmente seguro.",
      },
      {
        name: "Ácido ascórbico",
        riskLevel: "safe",
        description: "Vitamina C usada como mejorador de harina. Beneficioso, aunque en esta dosis no aporta valor nutricional significativo.",
      },
    ],
    alternatives: [
      { name: "Pan integral", brand: "Bimbo", score: 58 },
      { name: "Pan de masa madre", brand: "Panadería artesanal", score: 72 },
    ],
  },
  {
    barcode: "7793940500190",
    name: "Yogur Vainilla",
    brand: "La Serenísima",
    category: "Lácteos",
    emoji: "🍦",
    score: 52,
    rating: "Bueno",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: false,
    summary:
      "El yogur de vainilla La Serenísima tiene como base un buen lácteo pero le agregaron mucha azúcar (13g cada 100g). También contiene almidón modificado como espesante y sorbato de potasio como conservante. Un yogur natural sin azúcar sería mucho más saludable — podés agregarle fruta fresca vos mismo.",
    nutrition: {
      calories: 92,
      totalFat: 2.8,
      saturatedFat: 1.8,
      sodium: 55,
      totalCarbs: 14,
      sugars: 13,
      fiber: 0,
      protein: 3.5,
    },
    ingredients: [
      {
        name: "Leche parcialmente descremada",
        riskLevel: "safe",
        description: "Buena base láctea con calcio y proteínas. Menor contenido graso que la leche entera.",
      },
      {
        name: "Azúcar",
        riskLevel: "risky",
        description:
          "13g cada 100g — más de 3 cucharaditas en un vasito. Transforma un alimento saludable en un postre. La OMS recomienda máximo 25g/día.",
      },
      {
        name: "Almidón modificado",
        riskLevel: "moderate",
        description:
          "Espesante industrial que le da la textura cremosa. No es nocivo, pero indica un producto procesado. Reemplaza a la cremosidad natural del yogur.",
      },
      {
        name: "Saborizante a vainilla",
        riskLevel: "moderate",
        description:
          "Probablemente vainillina sintética, no vainilla real. Sin riesgo demostrado, pero es un indicador de sabor artificial.",
      },
      {
        name: "Cultivos lácteos",
        riskLevel: "safe",
        description:
          "Bacterias beneficiosas (probióticos) que fermentan la leche. Buenos para la flora intestinal y la digestión.",
      },
      {
        name: "Sorbato de potasio",
        riskLevel: "moderate",
        description:
          "Conservante (E202) que inhibe el crecimiento de moho y levaduras. Generalmente seguro, pero es otro aditivo innecesario en un producto fresco.",
      },
    ],
    alternatives: [
      {
        name: "Yogur natural sin azúcar",
        brand: "La Serenísima",
        score: 82,
      },
      {
        name: "Leche Entera",
        brand: "La Serenísima",
        score: 78,
        barcode: "7793940100011",
      },
    ],
  },
  {
    barcode: "7798085680019",
    name: "Manaos Cola",
    brand: "Manaos",
    category: "Bebidas",
    emoji: "🥤",
    score: 10,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: false,
    excessCalories: true,
    summary:
      "Manaos Cola combina lo peor de dos mundos: azúcar en exceso y edulcorantes artificiales (aspartamo y acesulfame K). El aspartamo es controvertido por estudios que lo asocian con posibles efectos neurológicos, y la OMS lo clasificó como posible cancerígeno en 2023. Igual de mala que una Coca-Cola pero con el agregado de edulcorantes artificiales.",
    nutrition: {
      calories: 44,
      totalFat: 0,
      saturatedFat: 0,
      sodium: 10,
      totalCarbs: 11,
      sugars: 11,
      fiber: 0,
      protein: 0,
    },
    ingredients: [
      {
        name: "Agua carbonatada",
        riskLevel: "safe",
        description: "Base de la bebida. Agua con gas, sin riesgo para la salud.",
      },
      {
        name: "Azúcar",
        riskLevel: "risky",
        description: "11g cada 100ml — una botella de 2.25L tiene 248g de azúcar, equivalente a 62 cucharaditas.",
      },
      {
        name: "Color caramelo IV",
        riskLevel: "risky",
        description:
          "Mismo colorante controvertido que Coca-Cola (E150d). Contiene 4-MEI, clasificado como posible cancerígeno por la IARC.",
      },
      {
        name: "Ácido fosfórico",
        riskLevel: "moderate",
        description: "Acidulante que puede erosionar el esmalte dental y reducir la absorción de calcio con el consumo frecuente.",
      },
      {
        name: "Saborizantes artificiales",
        riskLevel: "moderate",
        description: "Sustancias químicas que imitan el sabor cola. Sin riesgo comprobado pero son 100% artificiales.",
      },
      {
        name: "Cafeína",
        riskLevel: "moderate",
        description: "Estimulante. Puede causar insomnio y ansiedad en personas sensibles. No recomendada para niños.",
      },
      {
        name: "Aspartamo y Acesulfame K",
        riskLevel: "risky",
        description:
          "Edulcorantes artificiales. En 2023 la OMS clasificó al aspartamo como posible cancerígeno (Grupo 2B). El acesulfame K se asocia con alteraciones en la microbiota intestinal en estudios recientes.",
      },
    ],
    alternatives: [
      { name: "Agua mineral", brand: "Villavicencio", score: 95 },
      { name: "Jugo natural de naranja", brand: "Casero", score: 70 },
    ],
  },
  {
    barcode: "7790189003051",
    name: "Alfajor Mixto",
    brand: "Havanna",
    category: "Golosinas",
    emoji: "🍩",
    score: 18,
    rating: "Malo",
    novaGroup: 4,
    excessSugar: true,
    excessSodium: false,
    excessFat: false,
    excessSaturatedFat: true,
    excessCalories: true,
    summary:
      "El alfajor Havanna Mixto es una golosina premium pero igualmente poco saludable: 3 sellos de advertencia por exceso de azúcares, grasas saturadas y calorías. El 40% del producto es azúcar y contiene jarabe de glucosa como endulzante adicional. Es rico pero nutricionalmente muy pobre. Mejor reservarlo para ocasiones especiales.",
    nutrition: {
      calories: 450,
      totalFat: 22,
      saturatedFat: 14,
      sodium: 90,
      totalCarbs: 58,
      sugars: 40,
      fiber: 1,
      protein: 6,
    },
    ingredients: [
      {
        name: "Azúcar",
        riskLevel: "risky",
        description: "40g cada 100g — 10 cucharaditas en un alfajor. Primer ingrediente = componente principal.",
      },
      {
        name: "Harina de trigo",
        riskLevel: "safe",
        description: "Base de las tapas del alfajor. Harina refinada, baja en fibra.",
      },
      {
        name: "Dulce de leche",
        riskLevel: "moderate",
        description:
          "El relleno clásico argentino. Mezcla de leche y azúcar cocida. Delicioso pero básicamente leche con mucha azúcar concentrada.",
      },
      {
        name: "Grasa vegetal",
        riskLevel: "risky",
        description:
          "Probablemente aceite de palma. Alto en grasas saturadas (14g/100g), contribuye al aumento del colesterol LDL.",
      },
      {
        name: "Cacao en polvo",
        riskLevel: "safe",
        description: "Para la cobertura de chocolate. Aporta algo de antioxidantes, pero la cantidad es mínima.",
      },
      {
        name: "Leche en polvo",
        riskLevel: "safe",
        description: "Fuente de calcio y proteínas en la masa y el relleno.",
      },
      {
        name: "Huevo",
        riskLevel: "safe",
        description: "Ingrediente natural de la masa. Buena fuente de proteína completa.",
      },
      {
        name: "Jarabe de glucosa",
        riskLevel: "risky",
        description:
          "Endulzante industrial derivado del maíz. Es azúcar líquida con otro nombre. Usado para mejorar textura y durabilidad.",
      },
      {
        name: "Lecitina de soja",
        riskLevel: "safe",
        description: "Emulsionante natural. Ayuda a que el chocolate se mezcle bien. Sin riesgo.",
      },
      {
        name: "Saborizantes",
        riskLevel: "moderate",
        description: "Mezcla de saborizantes para potenciar el gusto. No se especifica si son naturales o artificiales.",
      },
    ],
    alternatives: [
      { name: "Barrita de cereal", brand: "Arcor", score: 48 },
      { name: "Frutos secos mixtos", brand: "Marolio", score: 75 },
    ],
  },
];

export const categories = [
  "Todas",
  "Bebidas",
  "Lácteos",
  "Galletitas",
  "Snacks",
  "Golosinas",
  "Panificados",
  "Carnes",
  "Almacén",
  "Congelados",
  "Otros",
];

export const categoryEmojis: Record<string, string> = {
  Todas: "🏷️",
  Bebidas: "🥤",
  Lácteos: "🥛",
  Galletitas: "🍪",
  Snacks: "🥔",
  Golosinas: "🍫",
  Panificados: "🍞",
  Carnes: "🥩",
  Almacén: "🫙",
  Congelados: "❄️",
  Otros: "📦",
};

export function getProductByBarcode(barcode: string): Product | undefined {
  return products.find((p) => p.barcode === barcode);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "Todas") return products;
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.barcode.includes(q)
  );
}
