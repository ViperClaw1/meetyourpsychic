import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PreMatchQuiz } from "@/components/prematch-quiz";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Find your advisor match — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Answer five quick questions about how you feel and what you need, and we'll match you with the right psychic advisor.",
      },
      { property: "og:title", content: "Find your advisor match — MeetYourPsychic" },
      {
        property: "og:description",
        content: "A one-minute quiz that pairs you with advisors suited to your reading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-secondary/40">
      <h1 className="sr-only">Pre-match quiz</h1>
      <PreMatchQuiz alwaysOpen onFinish={() => navigate({ to: "/client-dashboard" })} />
    </main>
  );
}
