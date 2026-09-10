import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Create a free MeetYourPsychic account to match with screened psychic advisors and start your first reading.",
      },
      { property: "og:title", content: "Create your account — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Join MeetYourPsychic and connect with trusted advisors by chat, call, or video.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LoginPage initialMode="register" />,
});
