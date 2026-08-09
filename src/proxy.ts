import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/marketplace(.*)",
  "/about(.*)",
  "/how-it-works(.*)",
  "/find-braiders(.*)",
  "/find-salons(.*)",
  "/opportunities(.*)",
  "/pricing(.*)",
  "/contact(.*)",
  "/blog(.*)",
  "/faq(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin/sign-in(.*)",
  "/admin/sign-up(.*)",
  "/admin/setup(.*)",
  "/api/webhooks/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
