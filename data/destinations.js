// data/destinations.js
// Prototipo AventuraRD — alcance limitado a la región Este de la República Dominicana.
// Categorías según la propuesta del asesor (se descartan Gastronomía y Cultura):
//   - Aventura (parapente, skydiving, buggies)
//   - Ecoturismo (senderismo, trail running)
//   - Turismo Comunitario (la ciudad y sus atracciones, comunidades locales)
export const destinations = [
  {
    id: "1",
    title: "Skydive Punta Cana",
    location: "Punta Cana, La Altagracia",
    category: "Aventura",
    image: require("../assets/destinations/01-skydive.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g01a.jpg"),
      require("../assets/destinations/gallery/g01b.jpg"),
    ],
    safety:
      "Actividad de riesgo alto operada con instructores certificados y equipo homologado. Peso máximo 100 kg. No apta para embarazadas ni personas con problemas cardíacos, de espalda o de presión arterial.",
    recommendations: [
      "Presenta un documento de identidad válido",
      "Firma el formulario de consentimiento y estado de salud",
      "Ropa cómoda y calzado deportivo cerrado",
      "No consumas alcohol antes del salto",
      "Llega 30 minutos antes para el briefing de seguridad",
    ],
    price: 295,
    rating: 4.9,
    duration: "Medio día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.5601, longitude: -68.3725 },
    timeSlots: ["07:00", "09:30", "12:00"],
    description:
      "Salto en paracaídas tándem sobre la costa Este de la República Dominicana. Desde 3,000 metros de altura disfrutarás de una vista única de las playas de Punta Cana, los arrecifes y los campos de coco antes del aterrizaje. La actividad incluye briefing de seguridad, equipo certificado e instructor profesional. Una de las experiencias de aventura más intensas de la región.",
    featured: true,
  },
  {
    id: "2",
    title: "Buggies Macao Adventure",
    location: "Playa Macao, La Altagracia",
    category: "Aventura",
    image: require("../assets/destinations/02-buggies.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g02a.jpg"),
      require("../assets/destinations/gallery/g02b.jpg"),
    ],
    safety:
      "Recorrido off-road de dificultad moderada. Uso obligatorio de casco y gafas. Para conducir se requieren 18 años y licencia; los menores solo pueden ir como acompañantes.",
    recommendations: [
      "Licencia de conducir para manejar el buggy",
      "Ropa que se pueda ensuciar y gafas de sol",
      "Protector solar y pañuelo para el polvo",
      "Sigue la ruta y las señas del guía en todo momento",
      "Firma el formulario de responsabilidad",
    ],
    price: 65,
    rating: 4.6,
    duration: "Medio día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.7556, longitude: -68.5436 },
    timeSlots: ["08:00", "11:00", "14:30"],
    description:
      "Recorrido off-road en buggies por los caminos rurales que conectan Punta Cana con Playa Macao. La ruta atraviesa fincas de caña, plantaciones de cacao y comunidades campesinas, con paradas en un cenote natural y en la playa de surf de Macao. Incluye casco, gafas y guía. Ideal para quienes buscan adrenalina y contacto con el entorno local del Este.",
    featured: true,
  },
  {
    id: "3",
    title: "Parapente en Montaña Redonda",
    location: "Miches, El Seibo",
    category: "Aventura",
    image: require("../assets/destinations/03-parapente.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g03a.jpg"),
      require("../assets/destinations/gallery/g03b.jpg"),
    ],
    safety:
      "Vuelo biplaza con piloto certificado, sujeto a las condiciones del viento. Peso máximo 110 kg. No recomendado para problemas cardíacos, de movilidad o vértigo severo.",
    recommendations: [
      "Documento de identidad",
      "Calzado cerrado y ropa abrigada (en la cima hace fresco)",
      "Sigue las instrucciones del piloto en el despegue",
      "Evita comidas pesadas antes del vuelo",
      "Firma el formulario de salud y consentimiento",
    ],
    price: 110,
    rating: 4.8,
    duration: "Medio día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.9325, longitude: -69.0689 },
    timeSlots: ["07:30", "10:00", "16:00"],
    description:
      "Vuelo en parapente desde la cima de la Montaña Redonda, a 350 metros sobre la bahía de Miches y la laguna Redonda. El despegue ofrece una panorámica de 360° del Este dominicano, entre el mar y los humedales protegidos. La experiencia incluye vuelo biplaza con piloto certificado y traslado en 4x4 hasta la cima. Naturaleza y aventura en estado puro.",
    featured: true,
  },
  {
    id: "4",
    title: "Parque Nacional Cotubanamá",
    location: "Bayahíbe, La Altagracia",
    category: "Ecoturismo",
    image: require("../assets/destinations/04-cotubanama.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g04a.jpg"),
      require("../assets/destinations/gallery/g04b.jpg"),
    ],
    safety:
      "Senderismo de dificultad moderada en área protegida, acompañado por guardaparques. Recorrido por cuevas y manglares; se requiere condición física básica.",
    recommendations: [
      "Calzado de senderismo y ropa fresca",
      "Repelente de insectos y protector solar",
      "Agua suficiente (mínimo 1.5 L)",
      "No extraigas flora, fauna ni piezas arqueológicas",
      "Regístrate con el guardaparques a la entrada",
    ],
    price: 50,
    rating: 4.7,
    duration: "1 día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.3242, longitude: -68.8016 },
    timeSlots: ["08:00"],
    description:
      "El antiguo Parque Nacional del Este protege bosques secos, cuevas con arte rupestre taíno y una costa de manglares única. Sus senderos ecológicos parten desde Bayahíbe y permiten observar fauna endémica como el zumbador y la cotorra. Una caminata guiada por los guardaparques de la comunidad para conocer el patrimonio natural mejor conservado de la región Este.",
    featured: false,
  },
  {
    id: "5",
    title: "Reserva Ecológica Ojos Indígenas",
    location: "Punta Cana, La Altagracia",
    category: "Ecoturismo",
    image: require("../assets/destinations/05-ojos-indigenas.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g05a.jpg"),
      require("../assets/destinations/gallery/g05b.jpg"),
    ],
    safety:
      "Sendero de nivel fácil apto para todas las edades dentro de una reserva privada. El baño está permitido solo en las lagunas habilitadas.",
    recommendations: [
      "Traje de baño y toalla",
      "Calzado cómodo y protector solar biodegradable",
      "Repelente de insectos",
      "No uses cremas ni bronceadores antes de bañarte en las lagunas",
      "Respeta los senderos señalizados",
    ],
    price: 35,
    rating: 4.6,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.6797, longitude: -68.4283 },
    timeSlots: ["08:30", "11:30", "15:00"],
    description:
      "Reserva privada de 600 hectáreas de bosque tropical en pleno corazón de Punta Cana. Sus senderos conectan doce lagunas de agua dulce cristalina alimentadas por manantiales subterráneos. Ideal para senderismo, trail running y avistamiento de aves. Un refugio de biodiversidad gestionado con criterios de conservación y educación ambiental.",
    featured: true,
  },
  {
    id: "6",
    title: "Hoyo Azul — Cap Cana",
    location: "Cap Cana, La Altagracia",
    category: "Ecoturismo",
    image: require("../assets/destinations/06-hoyo-azul.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g06a.jpg"),
      require("../assets/destinations/gallery/g06b.jpg"),
    ],
    safety:
      "Sendero de dificultad moderada hasta el cenote, con descenso por escaleras. El baño es bajo supervisión y hay chalecos disponibles.",
    recommendations: [
      "Traje de baño y calzado antideslizante",
      "Protector solar biodegradable",
      "Agua y gorra",
      "Sigue las indicaciones del guía en el cenote",
      "No te lances desde los acantilados",
    ],
    price: 45,
    rating: 4.7,
    duration: "Medio día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.4519, longitude: -68.4042 },
    timeSlots: ["09:00", "13:30"],
    description:
      "Cenote de aguas turquesas al pie de un acantilado de piedra caliza en Cap Cana. El sendero ecológico recorre el bosque tropical de la Reserva Punta Espada hasta llegar a esta laguna natural de profundidad cristalina. Caminata interpretativa sobre flora endémica y geología del Este. Una de las maravillas naturales más fotografiadas de la región.",
    featured: false,
  },
  {
    id: "7",
    title: "Salto de la Jalda",
    location: "Miches, Hato Mayor",
    category: "Ecoturismo",
    image: require("../assets/destinations/07-salto-jalda.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g07a.jpg"),
      require("../assets/destinations/gallery/g07b.jpg"),
    ],
    safety:
      "Excursión exigente de senderismo y travesía a caballo que requiere buena condición física. No apta para embarazadas ni personas con problemas cardíacos o de rodilla.",
    recommendations: [
      "Calzado de senderismo con buen agarre",
      "Ropa de cambio y traje de baño",
      "Repelente, protector solar y suficiente agua",
      "Snacks energéticos",
      "Contrata guía local y firma el formulario de la excursión",
    ],
    price: 70,
    rating: 4.8,
    duration: "1 día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.8722, longitude: -69.0850 },
    timeSlots: ["07:00"],
    description:
      "La cascada más alta del Caribe, con 120 metros de caída, escondida en la Reserva Científica Loma Quita Espuela hacia Miches. La excursión combina senderismo exigente y travesía a caballo a través de selva tropical y ríos. Un reto de trail y ecoturismo guiado por la comunidad local de El Seibo y Hato Mayor, recompensado con un baño en la poza natural.",
    featured: false,
  },
  {
    id: "8",
    title: "Mano Juan, Isla Saona",
    location: "Isla Saona, La Altagracia",
    category: "Turismo Comunitario",
    image: require("../assets/destinations/08-mano-juan-saona.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g08a.jpg"),
      require("../assets/destinations/gallery/g08b.jpg"),
    ],
    safety:
      "Excursión familiar por mar dentro de un parque nacional. El uso del chaleco salvavidas es obligatorio durante el trayecto en embarcación.",
    recommendations: [
      "Traje de baño, toalla y protector solar biodegradable",
      "Gorra y gafas de sol",
      "Efectivo para el almuerzo y la artesanía local",
      "Usa el chaleco salvavidas durante el trayecto",
      "No molestes ni alimentes a las tortugas del santuario",
    ],
    price: 80,
    rating: 4.7,
    duration: "1 día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.1281, longitude: -68.7019 },
    timeSlots: ["08:00"],
    description:
      "Mano Juan es el único poblado de pescadores de la Isla Saona, dentro del Parque Nacional Cotubanamá. Sus casas de madera de colores, su escuela y el santuario de tortugas marinas reflejan la vida de una comunidad caribeña auténtica. La visita apoya directamente a las familias locales con almuerzo típico, artesanía y recorridos guiados por sus propios habitantes.",
    featured: true,
  },
  {
    id: "9",
    title: "Pueblo de Bayahíbe",
    location: "Bayahíbe, La Romana",
    category: "Turismo Comunitario",
    image: require("../assets/destinations/09-bayahibe.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g09a.jpg"),
      require("../assets/destinations/gallery/g09b.jpg"),
    ],
    safety:
      "Recorrido a pie de nivel fácil por el pueblo y el malecón. Sin exigencia física; apto para todas las edades.",
    recommendations: [
      "Calzado cómodo para caminar",
      "Protector solar y gorra",
      "Efectivo para artesanía y cooperativas locales",
      "Respeta a la comunidad de pescadores",
      "Mantente hidratado durante el recorrido",
    ],
    price: 25,
    rating: 4.5,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.3636, longitude: -68.8389 },
    timeSlots: ["09:00", "15:00"],
    description:
      "Antiguo pueblo de pescadores convertido en puerta de entrada al turismo del Este. Bayahíbe conserva su malecón, sus barcas de colores y la cultura marinera de sus fundadores. Un recorrido a pie por la comunidad permite conocer a las cooperativas de pesca y buceo, comprar artesanía local y escuchar la historia de la rosa de Bayahíbe, flor nacional dominicana.",
    featured: false,
  },
  {
    id: "10",
    title: "Higüey y la Basílica",
    location: "Higüey, La Altagracia",
    category: "Turismo Comunitario",
    image: require("../assets/destinations/10-higuey-basilica.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g10a.jpg"),
      require("../assets/destinations/gallery/g10b.jpg"),
    ],
    safety:
      "Visita cultural de nivel fácil. Al tratarse de un espacio religioso, se pide vestimenta y comportamiento respetuosos.",
    recommendations: [
      "Documento de identidad",
      "Ropa fresca y respetuosa (hombros y rodillas cubiertos en la Basílica)",
      "Protector solar y gorra",
      "Efectivo para el mercado y los artesanos",
      "Respeta los momentos de oración y peregrinación",
    ],
    price: 20,
    rating: 4.4,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.6157, longitude: -68.7080 },
    timeSlots: ["09:00", "14:00"],
    description:
      "Higüey es el corazón histórico y espiritual de la región Este. Su Basílica de Nuestra Señora de la Altagracia, de arquitectura moderna icónica, recibe cada año a miles de peregrinos. El recorrido por la ciudad y sus atracciones incluye el mercado local, la calle de los artesanos y la gastronomía criolla, conectando al visitante con la vida cotidiana del Este dominicano.",
    featured: false,
  },
  {
    id: "11",
    title: "Boca de Yuma",
    location: "Boca de Yuma, La Altagracia",
    category: "Turismo Comunitario",
    image: require("../assets/destinations/11-boca-de-yuma.jpg"),
    gallery: [
      require("../assets/destinations/gallery/g11a.jpg"),
      require("../assets/destinations/gallery/g11b.jpg"),
    ],
    safety:
      "Paseo costero y en bote de nivel fácil. El uso del chaleco salvavidas es obligatorio durante el trayecto en bote.",
    recommendations: [
      "Traje de baño, toalla y protector solar",
      "Gorra y gafas de sol",
      "Efectivo para el almuerzo de pescado local",
      "Usa el chaleco salvavidas en el bote",
      "Sigue las indicaciones del guía en la Cueva de Berna",
    ],
    price: 30,
    rating: 4.5,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.3683, longitude: -68.6139 },
    timeSlots: ["09:30", "14:30"],
    description:
      "Tranquilo pueblo costero en la desembocadura del río Yuma, frontera del Parque Nacional Cotubanamá. Su comunidad pesquera ofrece paseos en bote por los acantilados, visita a la Cueva de Berna y degustación de pescado fresco preparado al estilo local. Un destino de turismo comunitario que mantiene viva la esencia del Este menos masificado.",
    featured: false,
  },
];

export const categories = [
  { id: "all", label: "Todos", icon: "grid" },
  { id: "Aventura", label: "Aventura", icon: "rocket" },
  { id: "Ecoturismo", label: "Ecoturismo", icon: "leaf" },
  { id: "Turismo Comunitario", label: "Comunitario", icon: "people" },
];

export const onboardingSlides = [
  {
    id: "1",
    title: "Descubre la región Este",
    description:
      "Explora los rincones más auténticos del Este de la República Dominicana. Desde cenotes escondidos hasta cascadas y pueblos de pescadores.",
    icon: "earth",
    color: "#2F9E62",
  },
  {
    id: "2",
    title: "Apoya comunidades locales",
    description:
      "Cada aventura conecta directamente con guías y familias locales. Tu viaje genera impacto real en las comunidades del Este.",
    icon: "people",
    color: "#1A6B9A",
  },
  {
    id: "3",
    title: "Vive el turismo de aventura",
    description:
      "Parapente, skydiving, buggies, senderismo y turismo comunitario. Experiencias responsables más allá del sol y playa.",
    icon: "leaf",
    color: "#F4A024",
  },
];
