/*
  SteadyFlow — all the outside links the website uses, in one place.
  To change a link, edit it here and every page updates.
  Leave a link as "" and the site falls back to email instead, so nothing is ever a dead button.
*/
window.SF_LINKS = {
  // Every "Book a call" button goes to our own branded booking page...
  booking: "book.html",
  // ...which shows the Google Calendar booking schedule inside it (free intro calls and onboarding calls)
  bookingEmbed: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3ye57mvU3wBO07s1_OSTeX1_vb-DlQ0_sxUTIy1AzqbBTAO-ZEv3CmqFSBgRr4Bcebm1vv4Ivj?gv=true",

  // Stripe customer portal login (clients manage their card, plan or cancellation)
  portal: "https://billing.stripe.com/p/login/5kQeVdc6ufbAgLj4Ct8g000",

  // Onboarding form: questionnaire + agreement acceptance
  onboarding: "https://docs.google.com/forms/d/e/1FAIpQLSdx-eHlctmwOLqfwj7aUEUnpwL7oYaXVzW-F2UwYQXX21ILnw/viewform",

  // Stripe payment links, one per plan
  pay: {
    presence: "https://buy.stripe.com/00wcN5eeC5B01Qp5Gx8g002",
    momentum: "https://buy.stripe.com/28E3cv9Ym6F4fHf6KB8g001",
    flow: "https://buy.stripe.com/5kQeVdc6ufbAgLj4Ct8g000"
  },

  // Client documents (Google Docs, view only)
  docs: {
    plan: "https://docs.google.com/document/d/1KUQ64AGNKyskXJMlfoi1tstN_wi2OTd7IbDRiIvn74Y/view",
    agreement: "https://docs.google.com/document/d/1NfUGFVp3zGVMORMEv6EWO_hG8cPpqCeCtfkE1nG_dKk/view",
    privacy: "https://docs.google.com/document/d/1V9pooa3oKXNeCqhhP52iKMWuHMfJmvTl1lL5zmydnoM/view",
    welcome: "https://docs.google.com/document/d/1yi0nUWR5SkmIXZi42njhRkF-EHud6gDW6QfB7RxLT2M/view"
  }
};
