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
    price: 295,
    rating: 4.9,
    duration: "Medio día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.5601, longitude: -68.3725 },
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
    price: 65,
    rating: 4.6,
    duration: "Medio día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.7556, longitude: -68.5436 },
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
    price: 110,
    rating: 4.8,
    duration: "Medio día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.9325, longitude: -69.0689 },
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
    price: 50,
    rating: 4.7,
    duration: "1 día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.3242, longitude: -68.8016 },
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
    price: 35,
    rating: 4.6,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.6797, longitude: -68.4283 },
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
    price: 45,
    rating: 4.7,
    duration: "Medio día",
    difficulty: "Moderado",
    coordinates: { latitude: 18.4519, longitude: -68.4042 },
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
    price: 70,
    rating: 4.8,
    duration: "1 día",
    difficulty: "Difícil",
    coordinates: { latitude: 18.8722, longitude: -69.0850 },
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
    price: 80,
    rating: 4.7,
    duration: "1 día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.1281, longitude: -68.7019 },
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
    price: 25,
    rating: 4.5,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.3636, longitude: -68.8389 },
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
    price: 20,
    rating: 4.4,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.6157, longitude: -68.7080 },
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
    price: 30,
    rating: 4.5,
    duration: "Medio día",
    difficulty: "Fácil",
    coordinates: { latitude: 18.3683, longitude: -68.6139 },
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
