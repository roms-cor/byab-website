export interface Testimonial {
  quote: string;
  /** Initials shown in the avatar circle */
  initials: string;
  author: string;
  role: string;
}

export const testimonial: Testimonial = {
  quote:
    "They didn't just take work off my plate. They rebuilt how my firm runs — and revenue followed.",
  initials: "ML",
  author: "M. Laurent",
  role: "Managing Partner, National Law Firm",
};
