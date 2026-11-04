// Publicerade kundomdömen. Lägg bara in omdömen som kommit via /omdome
// (eller skriftligt på annat sätt) där kunden har godkänt publicering.
// Avsnittet på startsidan visas automatiskt när listan inte är tom.

export interface Testimonial {
  name: string;
  /** T.ex. "Kassör i en idrottsförening". Valfritt. */
  title?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Liam',
    title: 'Företag',
    rating: 5,
    text: 'Edvin hjälpte mig att bygga ett Excel-ark som räknar ut mina provisionsmål utifrån försäljningen. Jag är väldigt nöjd!',
  },
];
